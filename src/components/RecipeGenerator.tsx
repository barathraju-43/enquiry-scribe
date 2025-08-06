import React, { useState } from 'react';
import { Button } from './ui/enhanced-button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ChefHat, Clock, Users, Plus, X, Sparkles } from 'lucide-react';

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Mediterranean', 
  'Low-Carb', 'High-Protein', 'Dairy-Free', 'Nut-Free'
];

const cuisineTypes = [
  'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American',
  'French', 'Thai', 'Chinese', 'Japanese', 'Korean', 'Spanish'
];

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  image: string;
}

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const generateRecipes = async () => {
    setIsGenerating(true);
    
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recipe generation based on ingredients
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: 'Mediterranean Herb Pasta',
        description: 'A fresh and flavorful pasta dish with aromatic herbs and seasonal vegetables.',
        cookTime: '25 min',
        servings: 4,
        difficulty: 'Easy',
        ingredients: ingredients.slice(0, 6),
        instructions: [
          'Boil pasta according to package directions',
          'Sauté garlic and herbs in olive oil',
          'Add vegetables and cook until tender',
          'Toss with pasta and serve hot'
        ],
        image: 'pasta'
      },
      {
        id: '2',
        title: 'Garden Fresh Stir-Fry',
        description: 'Quick and healthy stir-fry packed with fresh vegetables and bold flavors.',
        cookTime: '15 min',
        servings: 3,
        difficulty: 'Easy',
        ingredients: ingredients.slice(0, 5),
        instructions: [
          'Heat oil in a large pan or wok',
          'Add harder vegetables first',
          'Stir-fry until crisp-tender',
          'Season and serve over rice'
        ],
        image: 'stirfry'
      },
      {
        id: '3',
        title: 'Rustic Herb Soup',
        description: 'Warming soup with fresh herbs and seasonal ingredients.',
        cookTime: '40 min',
        servings: 6,
        difficulty: 'Medium',
        ingredients: ingredients.slice(0, 8),
        instructions: [
          'Sauté onions and garlic',
          'Add vegetables and broth',
          'Simmer until tender',
          'Blend if desired and season to taste'
        ],
        image: 'soup'
      }
    ];
    
    setRecipes(mockRecipes);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AI Chef Assistant
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your available ingredients into delicious, personalized recipes tailored to your dietary preferences
        </p>
      </div>

      {/* Input Section */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What's in your kitchen?
          </CardTitle>
          <CardDescription>
            Add your available ingredients and dietary preferences to get personalized recipe suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-3">
            <Label htmlFor="ingredients" className="text-base font-medium">
              Available Ingredients
            </Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                placeholder="Enter an ingredient (e.g., tomatoes, basil, chicken)"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                className="flex-1"
              />
              <Button onClick={addIngredient} variant="chef" size="default">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {ingredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="secondary"
                    className="px-3 py-1 text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Dietary Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((diet) => (
                <Badge
                  key={diet}
                  variant={selectedDiets.includes(diet) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleDiet(diet)}
                >
                  {diet}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Cuisine Types */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Preferred Cuisines</Label>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleCuisine(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={generateRecipes}
              disabled={ingredients.length === 0 || isGenerating}
              variant="hero"
              size="xl"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Generating Your Recipes...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Generate Personalized Recipes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {recipes.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Your Personalized Recipes
            </h2>
            <p className="text-muted-foreground">
              Found {recipes.length} delicious recipes using your ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-card"
              >
                <div className="h-48 bg-gradient-to-br from-chef-orange/20 to-accent/20 flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-primary/60" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{recipe.title}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {recipe.servings} servings
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 4).map((ingredient) => (
                        <Badge key={ingredient} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.ingredients.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button variant="elegant" className="w-full">
                    View Full Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {recipes.length === 0 && !isGenerating && (
        <Card className="bg-gradient-subtle border-dashed">
          <CardContent className="text-center py-12">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Cook Something Amazing?</h3>
            <p className="text-muted-foreground">
              Add your ingredients above and let our AI chef create personalized recipes just for you!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipeGenerator;