'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function WhisperPage() {
  const [audioUrl, setAudioUrl] = useState('')
  const [transcription, setTranscription] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/whisper?audio_url=${encodeURIComponent(audioUrl)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setTranscription(data.transcription)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Audio Transcription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transcribe Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter audio URL..."
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                'Transcribe'
              )}
            </Button>
          </form>
          {transcription && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Transcription:</h2>
              <p className="p-4 bg-secondary rounded-md">{transcription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

