'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/prompt?prompt=${encodeURIComponent(prompt)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setGeneratedPrompt(data.generatedPrompt)
    } catch (error) {
      console.error('Error generating prompt:', error)
      toast({
        title: "Error",
        description: `Failed to generate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Prompt Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Creative Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </form>
          {generatedPrompt && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Generated Prompt:</h2>
              <p className="p-4 bg-secondary rounded-md">{generatedPrompt}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

