import { aiGateway } from './AIGateway.js';
import { workflowEngine } from './WorkflowEngine.js';
import { eventBus } from '../../events/eventBus.js';

// Register the Profile Review Workflow
workflowEngine.registerWorkflow('profile_review_v1', {
  name: 'Comprehensive Profile Review',
  steps: [
    {
      id: 'photo_analysis',
      name: 'Analyze Photos',
      promptTemplate: 'Analyze these photo descriptions for dating profile quality: {{photos}}'
    },
    {
      id: 'bio_analysis',
      name: 'Analyze Bio',
      promptTemplate: 'Analyze this bio for dating profile quality. Current bio: {{bio}}'
    },
    {
      id: 'interests_analysis',
      name: 'Analyze Interests',
      promptTemplate: 'Analyze these interests for dating profile quality. Interests: {{interests}}'
    },
    {
      id: 'suggestions',
      name: 'Generate Suggestions',
      promptTemplate: 'Based on photo analysis: {{photo_analysis}}, bio analysis: {{bio_analysis}}, and interests: {{interests_analysis}}, generate 3 actionable improvement suggestions.'
    },
    {
      id: 'score',
      name: 'Generate Score',
      promptTemplate: 'Based on the full analysis, generate a single numeric score 0-100. Return JSON: {"score": 85}'
    }
  ]
});

class ProfileIntelligence {
  async reviewProfile(userId, profile) {
    const context = {
      photos: profile.photos?.map(p => p.url).join(', ') || 'No photos',
      bio: profile.bio || 'Empty',
      interests: profile.interests?.join(', ') || 'None'
    };

    const workflowResult = await workflowEngine.execute(userId, 'profile_review_v1', context);
    
    eventBus.publish('spark.ai.profile.reviewed.v1', { userId }).catch(() => {});
    
    try {
      const scoreData = JSON.parse(workflowResult.results.score);
      return { 
        score: scoreData.score || 50, 
        suggestions: [workflowResult.results.suggestions], 
        strengths: [],
        raw_workflow: workflowResult.results
      };
    } catch (e) {
      return { score: 50, suggestions: ['Review completed but scoring failed'], strengths: [] };
    }
  }

  async improveBio(userId, currentBio, interests) {
    const result = await aiGateway.complete(userId, 'BIO_GENERATION', [
      { role: 'system', content: 'You are a dating profile writer. Improve or generate a compelling dating bio (2-3 sentences max). Be authentic and engaging.' },
      { role: 'user', content: `Current bio: ${currentBio || 'None'}. Interests: ${interests?.join(', ') || 'general'}` }
    ]);
    eventBus.publish('spark.ai.bio.generated.v1', { userId }).catch(() => {});
    return result.content;
  }
}

export const profileIntelligence = new ProfileIntelligence();
