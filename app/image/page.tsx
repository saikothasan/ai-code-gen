'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function ImagePage() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/image?imgprompt=${encodeURIComponent(prompt)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Image Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate an Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter an image prompt..."
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
                'Generate Image'
              )}
            </Button>
          </form>
          {imageUrl && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Generated Image:</h2>
              <div className="relative w-full h-64">
                <Image src={imageUrl} alt="Generated Image" layout="fill" objectFit="contain" className="rounded-lg" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

