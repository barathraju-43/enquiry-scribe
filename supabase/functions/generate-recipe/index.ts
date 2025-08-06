import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface RecipeRequest {
  ingredients: string[];
  dietaryPreferences: string[];
  cuisineTypes: string[];
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, dietaryPreferences, cuisineTypes, userId }: RecipeRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating recipe for user:', userId);

    // Create the prompt for OpenAI
    const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}.
    
    Dietary preferences: ${dietaryPreferences.join(', ') || 'None'}
    Cuisine types: ${cuisineTypes.join(', ') || 'Any'}
    
    Please provide a JSON response with exactly this structure:
    {
      "title": "Recipe name",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "cookTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "cuisineType": "Italian"
    }
    
    Make sure all ingredients from the input are used, and the recipe is realistic and delicious.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef assistant. Always respond with valid JSON containing recipe data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const recipeContent = data.choices[0].message.content;

    // Parse the JSON response
    let recipeData;
    try {
      recipeData = JSON.parse(recipeContent);
    } catch (error) {
      console.error('Failed to parse recipe JSON:', recipeContent);
      throw new Error('Invalid recipe format received from AI');
    }

    // Save the recipe to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: savedRecipe, error: saveError } = await supabase
      .from('recipes')
      .insert({
        user_id: userId,
        title: recipeData.title,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        cuisine_type: recipeData.cuisineType,
        dietary_tags: dietaryPreferences,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving recipe:', saveError);
      throw new Error('Failed to save recipe');
    }

    console.log('Recipe saved successfully:', savedRecipe.id);

    return new Response(JSON.stringify(savedRecipe), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});