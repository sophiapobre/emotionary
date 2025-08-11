import EntryCard from "../components/EntryCard"
import MoodChart from "../components/MoodChart";
import ViewEntryModal from "../components/ViewEntryModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntries, resetEntry, selectEntry } from "../features/entries/entriesSlice";
import CreateEditEntryModal from "../components/CreateEditEntryModal";
import CreateButton from "../components/buttons/CreateButton";
import { useContext, useEffect } from "react";
import { decryptContent } from "../utils/crypto";
import { ShepherdTourContext } from "../utils/tour/ShepherdContext";
import { UserTourStatus, createTourSteps } from "../utils/tour/tourConfig";
import DailyPrompt from "../components/DailyPrompt";
import MentalHealthIndicator from "../components/MentalHealthIndicator";

const BACKEND_URL = "https://emotionary-api.onrender.com";

const Home = ({ cryptoKey }) => {
  const userId = useSelector((state) => state.auth.userId);
  const userName = useSelector((state) => state.auth.userName);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [prompt, setPrompt] = useState(null);

  const allEntries = useSelector((state) => state.entries.entries);
  const [decryptedEntries, setDecryptedEntries] = useState([]);
  const recentEntries = decryptedEntries.slice(0, 9);

  const activeEntryId = useSelector((state) => state.entries.activeEntry);
  const activeEntry = decryptedEntries.find(e => e._id === activeEntryId);

  const dispatch = useDispatch();
  const tour = useContext(ShepherdTourContext);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("onboarded") || UserTourStatus.NOT_STARTED);

  useEffect(() => {
    dispatch(fetchEntries());
    window.scrollTo(0, 0);
  }, [dispatch]);

  useEffect(() => {
    async function decryptAndStore() {
      if (!cryptoKey || !allEntries.length) {
        setDecryptedEntries([]);
        return;
      }

      const decrypted = await Promise.all(
        allEntries.map(async (entry) => {
          try {
            const content = await decryptContent(entry.content, entry.content_iv, cryptoKey);
            return { ...entry, content };
          } catch {
            return { ...entry, content: "[Unable to decrypt]" };
          }
        })
      );
      
      setDecryptedEntries(decrypted);
    }
    decryptAndStore();
  }, [cryptoKey, allEntries, dispatch]);

  const handleOpenCard = (id) => {
    setIsViewModalOpen(true);
    dispatch(selectEntry(id));

    if (tour?.isActive() && tour?.getCurrentStep()?.id === 'select-entry') {
      tour.next();
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsModalOpen(false);
    setPrompt(null);
    dispatch(resetEntry());

    if (tour?.isActive() && tour?.getCurrentStep()?.id === 'close-entry') {
      tour.next();
    }
  };

  const handleCreateModal = () => {
    setIsViewModalOpen(false);
    setIsModalOpen(true);
    setMode('create');

    if (tour?.isActive() && tour?.getCurrentStep()?.id === 'click-create-entry') {
      tour.next();
    }
  };

  const handleCreateFromPrompt = (currentPrompt) => {
    setIsViewModalOpen(false);
    setIsModalOpen(true);
    setMode('create');
    setPrompt(currentPrompt);
  }

  const handleEditEntry = () => {
    setIsViewModalOpen(false);
    setIsModalOpen(true);
    setMode('edit');
  }

  const handleSaveEntry = async () => {
    setIsModalOpen(false);
    dispatch(fetchEntries());
    dispatch(resetEntry());

    if (tour?.isActive() && tour?.getCurrentStep()?.id === 'click-save-entry') {
      tour.next();
    }
  }

  const handleTourSkip = () => {
    setOnboarded(UserTourStatus.SKIPPED);
    localStorage.setItem("onboarded", UserTourStatus.SKIPPED);
    if (tour?.isActive()) {
      tour.cancel();
    }
  }

  const handleTourComplete = async () => {
    setOnboarded(UserTourStatus.COMPLETED);
    localStorage.setItem("onboarded", UserTourStatus.COMPLETED);
    if (tour?.isActive()) {
      tour.cancel();
    }

    await fetch(`${BACKEND_URL}/users/complete-onboarding`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }

  useEffect(() => {
    dispatch(fetchEntries());
    window.scrollTo(0, 0);
  }, [dispatch]);

  useEffect(() => { // initialize tour
    if (!tour) return;
    
    if (onboarded === UserTourStatus.NOT_STARTED) {
      const steps = createTourSteps({ handleTourSkip, handleTourComplete });
      tour.addSteps(steps);
      tour.start();
    }
  }, [tour, onboarded]); 

  useEffect(() => { // cancel tour on unmount
    return () => {
      if (tour?.isActive()) {
        tour.cancel();
      }
    };
  }, [tour]);
  
  useEffect(() => { // cancel tour if attached elements are not in DOM
    if (!tour) return;

    const observer = new MutationObserver(() => {
      const currentStep = tour.getCurrentStep();
      const selector = currentStep?.options?.attachTo?.element;

      if (selector) {
        const el = document.querySelector(selector);

        if (!el) {
          console.log(`Element for "${currentStep.id}" not in DOM. Cancelling tour.`);
          tour.cancel();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [tour]);

  return (
      <>
        <h1>Hello, {userName} 👋🏻</h1>
        <p>Welcome to your emotion diary.</p> 
        <CreateButton onClick={handleCreateModal} />
        <MoodChart />
        <DailyPrompt onCreateFromPrompt={handleCreateFromPrompt}/>
        <h2>Recent Entries</h2>
        <EntryCard
          onClick={handleOpenCard}
          onEdit={handleEditEntry}
          entries={recentEntries}
        />
        <ViewEntryModal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditEntry}
          entry={activeEntry}
        />
        <CreateEditEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEntry}
          mode={mode}
          cryptoKey={cryptoKey}
          entry={activeEntry}
          prompt = {prompt}
        />
        <MentalHealthIndicator />
      </>
  )
}

export default Home;