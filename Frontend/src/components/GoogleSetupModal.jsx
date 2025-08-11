import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CloseButton from "./buttons/CloseButton";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setUserId } from "../features/users/usersSlice";
import { Checkbox, useTheme, Alert, Snackbar } from '@mui/material';
import { Link } from "@mui/material";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import PasskeyRequirements, { getPasskeyRequirements } from "./PasskeyRequirements";
import { deriveKey, encryptContent, decryptContent } from "../utils/crypto";

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://emotionary-backend.vercel.app";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

export default function GoogleSetupModal({ user, open, hide, setCryptoKey }) {
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const requirements = getPasskeyRequirements(passkey);

  const handleClose = () => {
    setAgreedToPolicy(false);
    setError(null);
    setShowError(false);
    hide();
  };

  const handleAgreeToPolicy = (e) => {
    setAgreedToPolicy(e.target.checked);
  };

  const handleChange = (e) => {
    setPasskey(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setShowError(false);

    // Verify whether passkey meets requirements
    if (!requirements.length || !requirements.uppercase || !requirements.number || !requirements.symbol) {
      setError("Your passkey must meet all requirements.");
      setShowError(true);
      return;
    }

    try {
      // Derive key from passkey and use user ID as salt
      const key = await deriveKey(passkey, user.id);
      setCryptoKey(key);

      // Encrypts the string "verified" with the derived key
      // This will be used to verify the passkey during login
      const { iv, content } = await encryptContent("verified", key);
      
      const response = await fetch(`${BACKEND_URL}/users/complete-setup`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, verifyPasskey_content: content, verifyPasskey_iv: iv }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete setup. Please try again.");
      }

      dispatch(setUserId({ userId: user.id, userName: user.name, userEmail: user.email }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during signup:", error);
      setError(`Setup failed: ${error.message}`);
      setShowError(true);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setShowError(false);

    try {
      // Derive key from passkey and use user ID as salt
      const key = await deriveKey(passkey, user.id);

      // Fetch the encrypted verification value and IV from the server
      const response = await fetch(`${BACKEND_URL}/users/verify-passkey/${user.id}`);
      if (!response.ok) {
        throw new Error("Could not verify user. Please try again.");
      }
      const { iv, content } = await response.json();

      try {
        // Try to decrypt the verification value using the derived key
        const decryptedValue = await decryptContent(content, iv, key);
        if (decryptedValue !== "verified") {
          throw new Error("Invalid passkey. Please try again.");
        }

        // Verification successful
        setCryptoKey(key);
        dispatch(setUserId({ userId: user.id, userName: user.name, userEmail: user.email }));
        navigate("/dashboard");
      } catch (err) {
        throw new Error("Invalid passkey. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError(error.message);
      setShowError(true);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            align="center"
          >
            {user?.setupComplete ? "Sign In" : "Sign Up"}
          </Typography>
          <CloseButton onClick={handleClose} />
          <Box
            component="form"
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={user?.setupComplete
                ? (event) => {
                    event.preventDefault();
                    handleSignIn(event);
                  }
                : handleSignUp
            }
          >
            <TextField
              name="Passkey"
              label="Passkey"
              type={showPasskey ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={passkey}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#fbbbeb",
                  },
                },
                "& label.Mui-focused": {
                  color: "#3d3d3d",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
                      onClick={() => setShowPasskey((show) => !show)}
                      edge="end"
                    >
                      {showPasskey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Passkey requirements */}
            {!user?.setupComplete && (
              <PasskeyRequirements requirements={requirements} />
            )}
            {user?.setupComplete ? "" : (
              <>
                <Typography variant="caption">
                  We require users who sign up using their Google email address to set up a passkey for security.
                  Your passkey is used to lock and unlock your journal. 
                  Please treat your passkey like a password and remember it. You will need it to log in.
                  If you forget your passkey, your data cannot be recovered.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox 
                    checked={agreedToPolicy} 
                    onChange={handleAgreeToPolicy} 
                    required
                    sx={{ p: 0, paddingRight: '8px' }}
                  />
                  <Typography variant="body2">
                    I agree to the {" "}
                    <Link 
                      onClick={() => setShowPolicy(true)} 
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      privacy policy
                    </Link>
                    .*
                  </Typography>
                </Box>
              </>
            )}
            <Button
              type="submit"
              disabled={!user?.setupComplete && !agreedToPolicy}
              variant="contained"
              sx={{
                backgroundColor: "#ffe59a",
                color: "#3d3d3d",
                borderRadius: "30px",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              {user?.setupComplete ? "Sign In" : "Sign Up"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <PrivacyPolicyModal show={showPolicy} hide={() => setShowPolicy(false)} />
      
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
