import { useState } from 'react'
import './App.css'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generateReply, setGenerateReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setIsEditing(false)
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      })
      setGenerateReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
    } catch (err) {
      setError('Failed to generate the email reply, try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ background: '#fff', padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h3" gutterBottom>
          Smart Email Reply Generator
        </Typography>

        {/* Email input */}
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Tone selector */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="tone-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-label"
            id="tone-select"
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        {/* Generate button */}
        <Button variant="contained" fullWidth onClick={handleSubmit} disabled={!emailContent || loading}>
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>

        {/* Error */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Generated reply */}
        {generateReply && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={generateReply}
              onChange={(e) => setGenerateReply(e.target.value)}
              InputProps={{ readOnly: !isEditing }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant={isEditing ? 'contained' : 'outlined'} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              <Button variant="outlined" onClick={() => navigator.clipboard.writeText(generateReply)}>
                Copy to Clipboard
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default App
