/**
 * Cognitive Sentiment Service
 * Provides real-time sentiment interception for user comments and posts.
 * Leverages Azure Text Analytics / Cognitive Services API when configured,
 * with fallback to local NLP Sentiment Engine.
 */

const axios = require('axios')
let Sentiment = null
try {
  Sentiment = require('sentiment')
} catch (e) {
  Sentiment = null
}

const localSentiment = Sentiment ? new Sentiment() : null

/**
 * Analyzes the sentiment of a text string.
 * @param {string} text The text to analyze
 * @returns {Promise<{ sentiment: string, score: number, comparative: number, confidence: number }>}
 */
const analyzeSentiment = async (text) => {
  if (!text || typeof text !== 'string') {
    return { sentiment: 'neutral', score: 0, comparative: 0, confidence: 1.0 }
  }

  const endpoint = process.env.AZURE_COGNITIVE_ENDPOINT
  const apiKey = process.env.AZURE_COGNITIVE_KEY

  if (endpoint && apiKey) {
    try {
      const url = `${endpoint.replace(/\/$/, '')}/text/analytics/v3.1/sentiment`
      const response = await axios.post(
        url,
        {
          documents: [
            {
              id: '1',
              language: 'en',
              text: text,
            },
          ],
        },
        {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 4000,
        }
      )

      if (
        response.data &&
        response.data.documents &&
        response.data.documents.length > 0
      ) {
        const doc = response.data.documents[0]
        const sentiment = doc.sentiment // 'positive', 'neutral', 'negative', or 'mixed'
        const confScores = doc.confidenceScores || {}
        const confidence = confScores[sentiment] || 0.8
        const score = sentiment === 'positive' ? 2 : sentiment === 'negative' ? -2 : 0

        return {
          sentiment,
          score,
          comparative: score / (text.split(' ').length || 1),
          confidence,
          provider: 'azure-cognitive-services',
        }
      }
    } catch (azureErr) {
      console.warn(
        'Azure Cognitive Services unavailable, failing over to local NLP engine:',
        azureErr.message
      )
    }
  }

  // Local NLP Sentiment Analysis
  if (localSentiment) {
    const result = localSentiment.analyze(text)
    let classification = 'neutral'
    if (result.score > 0) {
      classification = 'positive'
    } else if (result.score < 0) {
      classification = 'negative'
    }

    return {
      sentiment: classification,
      score: result.score,
      comparative: result.comparative,
      confidence: Math.min(1.0, 0.5 + Math.abs(result.comparative) * 0.5),
      provider: 'local-nlp-engine',
    }
  }

  return {
    sentiment: 'neutral',
    score: 0,
    comparative: 0,
    confidence: 1.0,
    provider: 'default',
  }
}

module.exports = {
  analyzeSentiment,
}
