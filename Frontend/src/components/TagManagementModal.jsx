import React, { useState, useEffect } from 'react';
import {  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { tagColours } from '../utils/helpers';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LetterButton from './buttons/LetterButton';

const BACKEND_URL = "https://emotionary-api.onrender.com";

const TagManagementModal = ({ open, onClose, userId, userTags = [], onTagUpdated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'warning' });
  const [tagToDelete, setTagToDelete] = useState(null);

  // console.log('userTags: ', userTags);

  useEffect(() => {
    if (!open) {
      setEditingTagId(null);
      setEditedName('');
      setName('');
      setShowCreateForm(false);
      setSnackbar({ open: false, message: '', severity: 'warning'});
      setTagToDelete(null);
    }
  }, [open]);

  const handleCreateTag = async () => {
    if (!name.trim()) return showSnackbar('Please enter a tag name.');
    if (userTags.length >= 10) return showSnackbar('You have reached the maximum number of tags allowed.');

    const tagNameExists = userTags.find(tag => tag.name.toLowerCase() === name.trim().toLowerCase());
    if (tagNameExists) {
      return showSnackbar('A tag with this name already exists.');
    }

    const usedColors = userTags.map(tag => tag.colour);
    const availableColor = tagColours.find(color => !usedColors.includes(color));
    if (!availableColor) return alert('No more tag colours available.');

    try {
      const response = await fetch(`${BACKEND_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, colour: availableColor, user_id: userId }),
      });

      if (!response.ok) throw new Error('Failed to create tag');
      setName('');
      setShowCreateForm(false);
      onTagUpdated?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTag = async (tagId) => {

    try {
      const response = await fetch(`${BACKEND_URL}/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tag');
      onTagUpdated?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditTag = async (tagId) => {
    if (!editedName.trim()) return;

    const tagNameExists = userTags.find(tag => tag.name.toLowerCase() === editedName.trim().toLowerCase() && tag._id !== tagId);
    if (tagNameExists) {
      showSnackbar('A tag with this name already exists.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/tags/${tagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName }),
      });

      if (!response.ok) throw new Error('Failed to update tag');
      setEditingTagId(null);
      setEditedName('');
      onTagUpdated?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelCreate = () => {
    setName('');
    setShowCreateForm(false);
  };

  const showSnackbar = (message, severity = 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <>
      {/* https://stackoverflow.com/questions/79006592/aria-hidden-warning-on-closing-mui-dialogue */}
      <Dialog
        open={open}
        onClose={onClose}
        closeAfterTransition={false}
        sx={{ zIndex: 10000 }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              minWidth: 450,
              fontFamily: "Outfit, sans-serif",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Manage Tags
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 , paddingBottom: 4}}
        >
          {/* Existing tag list */}
          {userTags.map((tag) => (
            <Box
              key={tag._id}
              sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 1, borderRadius: 2 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: tag.colour,
                  mr: 1,
                }}
              />

              {editingTagId === tag._id ? (
                <>
                  <TextField
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton onClick={() => handleEditTag(tag._id)}>
                    <CheckIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography sx={{ flex: 1, fontSize: "16px"}}>{tag.name}</Typography>
                  <IconButton
                    onClick={() => {
                      setEditingTagId(tag._id);
                      setEditedName(tag.name);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}

              <IconButton onClick={() => setTagToDelete(tag)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          {/* Create tag flow */}
          {!showCreateForm ? (
            <LetterButton onClick={() => setShowCreateForm(true)}>
              Create Tag
            </LetterButton>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField
                label="Tag Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  onClick={handleCancelCreate}
                  style={{
                    color: "#b91313ff",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTag}
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  Save Tag
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions> */}
      </Dialog>

      {/* show snackbar alert if user attempts to create >10 tags */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        sx={{ zIndex: 10001 }}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* delete tag confirmation window */}
      <Dialog
        open={Boolean(tagToDelete)}
        onClose={() => setTagToDelete(null)}
        sx={{ zIndex: 10001 }}
        slotProps={{ paper: { sx: { borderRadius: 4, minWidth: 400 } } }}
      >
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tag{" "}
            <strong>{tagToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button onClick={() => setTagToDelete(null)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteTag(tagToDelete._id);
              setTagToDelete(null);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TagManagementModal;