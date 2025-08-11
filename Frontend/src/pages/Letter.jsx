import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LetterButton from "../components/buttons/LetterButton";
import "./Letter.css";
import "./Timecapsule.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useTheme } from '@mui/material';

const BACKEND_URL = "https://emotionary-api.onrender.com";

const Letter = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    date: null,
    content: "",
  });

  const [isComfirmed, setIsConfirmed] = useState(false);

  const { userEmail } = useSelector((state) => state.auth);

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleEmailChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleContinue = () => {
    setError(null);
    setShowError(false);
    setIsOpen(true);
  };

  const checkEmail = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!formData.date || !formData.email) return;
    if (formData.email !== userEmail) {
      setIsConfirmed(true);
    } else {
      handleSave(event);
    }
  };

  const handleTestSend = async () => {
    if (!formData.content) return;
    setIsOpen(false);
    setError(null);
    setShowError(false);

    try {
      const response = await fetch(
        `${BACKEND_URL}/email/send-email-test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: formData.content,
          }),
        }
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send test email");
      }

      navigate("/timecapsule", { state: { fromWrite: true } });
    } catch (error) {
      setError(`Failed to send test email: ${error.message}`);
      setShowError(true);
      return;
    }
  };

  const handleSave = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setIsOpen(false);
    setError(null);
    setShowError(false);

    try {
      const response = await fetch(
        `${BACKEND_URL}/email/schedule-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: formData.email,
            content: formData.content,
            scheduledTime: formData.date.toISOString(),
          }),
        }
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to schedule email");
      }

      navigate("/timecapsule", { state: { fromWrite: true } });
    } catch (error) {
      setError(`Failed to schedule email: ${error.message}`);
      setShowError(true);
      return;
    }
  };

  return (
    <div>
      <div className="letter-container">
        <textarea
          className="letter-textarea"
          placeholder="Write a letter to your future self..."
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      </div>

      <div>
        <button
          className="future-letter-button"
          onClick={handleContinue}
          disabled={!formData.content.trim()}
        >
          Continue
        </button>
      </div>

      <Dialog
        open={isComfirmed}
        onClose={() => {
          setIsConfirmed(false);
        }}
      >
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: "1.2rem", color: "#333", margin: "10px 0 36px" }}
          >
            Are you sure you want to send this letter to a different email
            address?
          </DialogContentText>
          <DialogContentText
            sx={{ fontSize: "1rem", color: "#666", marginBottom: "20px" }}
          >
            You're sending to: <strong>{formData.email}</strong>
            <br />
            Your account email is: <strong>{userEmail}</strong>
          </DialogContentText>
          <DialogActions>
            <LetterButton onClick={() => setIsConfirmed(false)}>
              Cancel
            </LetterButton>
            <LetterButton
              onClick={() => {
                setIsConfirmed(false);
                handleSave();
              }}
            >
              Confirm
            </LetterButton>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: "1.2rem", color: theme.palette.text.primary, margin: "10px 0 36px" }}
          >
            Please enter your email address and the date you want to receive the letter.
          </DialogContentText>

          <form onSubmit={checkEmail}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "36px",
                marginLeft: "15px",
                marginRight: "15px",
              }}
            >
              <TextField
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={formData.email}
                onChange={handleEmailChange}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  label="Date"
                  value={formData.date}
                  shouldDisableDate={(date) =>
                    dayjs(date).isSame(dayjs(), "day")
                  }
                  sx={{ width: "70%" }}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      error: !formData.date && formSubmitted,
                      helperText:
                        !formData.date && formSubmitted
                          ? "Please select a date"
                          : "",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <DialogActions>
              <LetterButton onClick={() => setIsOpen(false)}>
                Cancel
              </LetterButton>
              <LetterButton type="submit">Send</LetterButton>
              <LetterButton onClick={() => handleTestSend()}>
                Test Send
              </LetterButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Letter;
