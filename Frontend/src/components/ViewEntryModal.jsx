import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useDispatch } from "react-redux";
import { Box, Chip } from '@mui/material';
import { getDate } from '../utils/helpers';
import EditButton from './buttons/EditButton'
import MoodButton from './buttons/MoodButton';
import { fetchEntries } from '../features/entries/entriesSlice';

const BACKEND_URL = "https://emotionary-backend.vercel.app";

// base component: https://mui.com/material-ui/react-dialog/
const ViewEntryModal = ({ isOpen, onClose, onEdit, entry }) => {
  const dispatch = useDispatch();
  
  const handleSelectMood = async (selectedMood) => {
    try {
      await fetch(`${BACKEND_URL}/entries/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood }),
      });
      dispatch(fetchEntries());
    } catch (err) {
      window.alert(err.message);
    }
  }

  if (!entry) return null;

  return (
    <>
      <Dialog
        id='view-entry'
        key={entry._id} // Ensures that the dialog updates when the entry changes
        disableScrollLock
        onClose={onClose}
        open={isOpen}
        slotProps={{ // https://stackoverflow.com/questions/51722676/react-js-how-to-add-style-in-paperprops-of-dialog-material-ui
          paper: {
            sx: {
            width: '80vw',
            maxHeight: '60vh',
            borderRadius: 4,
            fontFamily: 'Outfit, sans-serif' 
          }
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontFamily: 'Outfit, sans-serif' , display: 'flex-col' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '94%' }}>
            <Typography sx={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', overflowWrap: 'break-word', whiteSpace: 'normal', minWidth: 0 }}>
              {entry.title}
            </Typography>
            <MoodButton onSelectMood={handleSelectMood} mood={entry.mood} />
          </Box>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif' }}>
              {getDate(entry.date)}
            </Typography>
        </DialogTitle>
        <IconButton
          id='close-button'
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ fontFamily: 'Outfit, sans-serif', p: 2 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif' }}>
            {entry.content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {entry.tags.map((tag) => (
              <Chip key={tag._id} label={tag.name} sx={{ bgcolor: tag.colour, m: 1, border:`2px solid ${tag.colour}`, fontFamily: 'Outfit, sans-serif' }}/>
            ))}
          </Box>
          <EditButton onClick={() => onEdit()} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewEntryModal;