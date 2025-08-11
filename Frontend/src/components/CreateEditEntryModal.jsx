import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Box, Chip, Backdrop, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { selectSortedTags } from "../features/tags/tagsSelectors";
import SaveButton from "./buttons/SaveButton";
import { fetchEntries } from "../features/entries/entriesSlice";
import { useDispatch } from "react-redux";
import { InferenceClient } from "@huggingface/inference";
import TagManagementModal from "./TagManagementModal";
import { sentimentEmojiMap, emojiSentimentMap } from "../utils/helpers";
import { fetchTags } from "../features/tags/tagsSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { encryptContent } from "../utils/crypto";
import { sensitiveKeywords } from '../utils/helpers';
import MentalHealthIndicator from './MentalHealthIndicator';
import LetterButton from "./buttons/LetterButton";

const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_ID);

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://emotionary-backend.vercel.app";

// base component: https://mui.com/material-ui/react-dialog/
const CreateEditEntryModal = ({
  isOpen,
  onClose,
  onSave,
  mode,
  cryptoKey,
  entry,
  prompt,
}) => {
  const tags = useSelector(selectSortedTags);
  const userId = useSelector((state) => state.auth.userId);
  const [formData, setFormData] = useState({
    title: "",
    date: null,
    content: "",
  });
  const [activeTags, setActiveTags] = useState([]); // this is a list of tag ids
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [id, setId] = useState("");
  const [alert, setAlert] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });
  const dispatch = useDispatch();
  const [edited, setEdited] = useState(false);
  const [showMHIModal, setShowMHIModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  const emojis = Object.keys(emojiSentimentMap);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTags());
    }

    if (mode === "create") {
      setFormData({ title: "", date: null, content: "" });
      setActiveTags([]);
      setId("");
      setEdited(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (entry && !edited) {
      setFormData({
        title: entry.title,
        date: dayjs(entry.date),
        content: entry.content,
      });
      setActiveTags(entry.tags ? entry.tags.map((tag) => tag._id || tag) : []);
      setId(entry._id);
    }
  }, [entry]);

  useEffect(() => {
    if (mode === "create") {
      setFormData({ title: "", date: null, content: "" });
      setActiveTags([]);
    } else if (mode === "edit") {
      setFormData({
        title: entry.title,
        date: dayjs(entry.date),
        content: entry.content,
      });
      setActiveTags(entry.tags ? entry.tags.map((tag) => tag._id || tag) : []);
      setId(entry._id);
    }
  }, [mode]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, emojis.length]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEdited(true);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    const now = dayjs();
    if (date.isAfter(now)) {
      showSnackbar("You can't select a future date or time.");
      return;
    }
    setEdited(true);
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const getSentiment = async (content) => {
    const sentimentAnalysis = client.textClassification({
      // returns an array of predictions (label + score)
      provider: "hf-inference",
      model: "tabularisai/multilingual-sentiment-analysis",
      inputs: content,
    });

    const time = 6000;
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Sentiment analysis timed out after ${time / 1000} seconds`)
        );
      }, time);
    });

    try {
      const sentimentAnalysisResult = await Promise.race([
        sentimentAnalysis,
        timeout,
      ]);

      const sentimentLabel = sentimentAnalysisResult?.[0]?.label; // gets the label with the highest scoring prediction
      return sentimentEmojiMap[sentimentLabel];
    } catch (err) {
      console.log("Error during sentiment analysis:", err.message);
      showSnackbar(
        "Whoops, sentiment analysis isn't working at the moment. You can always update your mood by viewing an entry."
      );
      return null;
    }
  };

  const handleSubmit = async () => {
    const { title, date, content } = formData;
    const isValid = title.trim() !== "" && date && content.trim() !== "";

    if (!isValid) {
      showSnackbar("Journal title, date, and content are required.");
      return;
    } 
    
    if (containsSensitiveContent(title, content)) {
        setShowMHIModal(true);
        console.log('showMHIModal', showMHIModal);
    }

    setIsLoading(true);

    try {
      const mood = await getSentiment(content);

      const { iv, content: encryptedContent } = await encryptContent(
        content,
        cryptoKey
      );

      const entryData = {
        title,
        date: date.toISOString(),
        content: encryptedContent,
        content_iv: iv,
        tags: activeTags,
        favorite: entry?.favorite ? entry.favorite : false,
        user_id: userId,
        mood: mood ? mood : "😐",
      };

      let response;
      if (mode === "create") {
        console.log("in create mode");
        response = await fetch(`${BACKEND_URL}/entries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });
      } else if (mode === "edit") {
        console.log("in edit mode");
        console.log(id);
        response = await fetch(`${BACKEND_URL}/entries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      await response.json();
      await dispatch(fetchEntries());
      
      setId("");
      setFormData({ title: "", date: null, content: "" });
      setActiveTags([]);
      setEdited(false);
      
      onSave();
    } catch (err) {
      showSnackbar(err.message || "Failed to save entry", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAlert(false);
    setFormData({ title: "", date: null, content: "" });
    setActiveTags([]);
    setEdited(false);
    onClose();
  };

  const toggleTag = (id) => {
    setEdited(true);
    const exists = activeTags.some((tid) => tid === id);

    if (exists) {
      setActiveTags(activeTags.filter((tid) => tid !== id));
    } else {
      if (activeTags.length >= 3) {
        // max 3 tags per entry
        showSnackbar("You can only select up to 3 tags at a time.");
        return;
      }
      setActiveTags([...activeTags, id]);
    }
  };

  const handleTags = () => {
    dispatch(fetchTags());
    dispatch(fetchEntries());
  };

  const showSnackbar = (message, severity = "warning") => {
    setSnackbar({ open: true, message, severity });
  };

  function containsSensitiveContent(title, content) {
    const entryTitle = title.toLowerCase();
    const entryContent = content.toLowerCase();

    return sensitiveKeywords.some(keyword => 
      entryTitle.includes(keyword) || entryContent.includes(keyword)
    );
  }

  return (
    <>
      <Dialog
        disableScrollLock
        onClose={() => {
          if (isLoading) return;
          if (edited) {
            setAlert(true);
          } else {
            handleClose();
          }
        }}
        open={isOpen}
        slotProps={{
          // https://stackoverflow.com/questions/51722676/react-js-how-to-add-style-in-paperprops-of-dialog-material-ui
          paper: {
            sx: {
              width: "80vw",
              overflow: "hidden",
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "flex-end" }}
        >
          {/* Title field */}
          <TextField
            id="create-entry-title"
            required
            label="Title"
            name="title"
            variant="outlined"
            placeholder="Title"
            sx={{ width: 270, paddingRight: 2 }}
            slotProps={{
              htmlInput: {
                maxLength: 40,
              },
              inputLabel: {
                required: false,
              },
            }}
            value={formData.title}
            onChange={handleInputChange}
          />
          {/* Date picker */}
          <Box id="create-entry-date">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                slotProps={{
                  popper: {
                    zindex: 10000,
                  },
                }}
                required
                disableFuture
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Box>
        </DialogTitle>
        <IconButton
          aria-label="close"
          disabled={isLoading}
          onClick={() => {
            if (isLoading) return;
            if (edited) {
              setAlert(true);
            } else {
              handleClose();
            }
          }}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
          })}
        >
          <CloseIcon />
        </IconButton>
        {/* Main entry field */}
        <DialogContent dividers sx={{ p: 2 }}>
          <TextField
            id="create-entry-content"
            required
            name="content"
            variant="outlined"
            placeholder={prompt ? prompt : "Today, I'm feeling..."}
            fullWidth
            multiline
            rows={8}
            value={formData.content}
            onChange={handleInputChange}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            {tags.map((tag) => (
              <Chip
                key={tag._id}
                label={tag.name}
                sx={{
                  "&:focus": {
                    boxShadow: `0 0 0 2px ${tag.colour}`,
                    borderColor: tag.colour,
                  },
                  bgcolor: tag.colour,
                  mt: 1,
                  mr: 1,
                  cursor: "pointer",
                  border: `2px solid ${tag.colour}`,
                  opacity: activeTags.includes(tag._id) ? 1 : 0.5,
                  boxShadow: activeTags.includes(tag._id)
                    ? `0 0 0 2px #fff inset`
                    : "none",
                }}
                onClick={() => toggleTag(tag._id)}
              />
            ))}
            <Box
              sx={{
                mt: 1.3,
                ml: 0.3,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <LetterButton
                id="create-entry-manage-tags"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                onClick={() => setIsManageTagsOpen(true)}
              >
                + Manage Tags
              </LetterButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </SaveButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={alert}
        onClose={() => setAlert(false)}
        closeAfterTransition={false} // https://stackoverflow.com/questions/79006592/aria-hidden-warning-on-closing-mui-dialogue
        sx={{ zIndex: 10001 }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle>Are you sure you want to leave?</DialogTitle>
        <DialogContent>
          Any changes you have made will not be saved.
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button onClick={() => setAlert(false)}>Continue editing</Button>
          <Button onClick={handleClose} color="error">
            Yes, I want to close
          </Button>
        </DialogActions>
      </Dialog>
      <TagManagementModal
        open={isManageTagsOpen}
        onClose={() => setIsManageTagsOpen(false)}
        userId={userId}
        userTags={tags}
        onTagUpdated={handleTags}
      />
      {/* 
        Show alert if user: 
          - attempts to add >3 tags
          - creates/edits entry without title/date/content
          - attemps to select a future date/time 
      */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: 2 }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <MentalHealthIndicator containsSensitiveContent={showMHIModal}/>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 10002,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        open={isLoading}
      >
        <Box
          sx={{
            fontSize: "4rem",
            animation: "pulse 0.5s ease-in-out infinite alternate",
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "100%": {
                transform: "scale(1.2)",
              },
            },
          }}
        >
          {emojis[currentEmojiIndex]}
        </Box>
        <Typography variant="h6" component="div">
          Analyzing your mood and saving entry...
        </Typography>
      </Backdrop>
    </>
  );
};

export default CreateEditEntryModal;
