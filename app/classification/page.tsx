'use client'

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function ClassificationPage() {
  const [textPrompt, setTextPrompt] = useState('')
  const [classification, setClassification] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/classification?textprompt=${encodeURIComponent(textPrompt)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setClassification(data.classification)
    } catch (error) {
      console.error('Error classifying text:', error)
      toast({
        title: "Error",
        description: "Failed to classify text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Text Classification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Classify Text using DistilBERT</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter text to classify..."
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              rows={4}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying...
                </>
              ) : (
                'Classify Text'
              )}
            </Button>
          </form>
          {classification && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Classification Result:</h2>
              <p className="p-4 bg-secondary rounded-md">{classification}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

