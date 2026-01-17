import { useState } from 'react';
import { Search, Clock, Users, ChefHat, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAiChef } from '@/hooks/useAiChef';
import { showSuccess, showError } from '@/utils/toast';

export function RecipeSuggestions() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { loading: aiLoading } = useAiChef();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    try {
      // Simulate AI recipe generation (in a real app, this would call an API)
      const mockRecipes = [
        `Quick ${cuisine || ''} Pasta with ${ingredients.split(',')[0]}`,
        `Healthy ${cuisine || ''} Bowl with Fresh Vegetables`,
        `One-Pan ${cuisine || ''} Dish - Ready in ${cookingTime || '30 minutes'}`,
        `Family-Style ${cuisine || ''} Casserole (Serves ${servings || '4'})`,
      ];
      
      // Add dietary restriction consideration
      if (dietaryRestrictions) {
        const filteredRecipes = mockRecipes.map(recipe => 
          `${recipe} (${dietaryRestrictions} friendly)`
        );
        setRecipes(filteredRecipes);
      } else {
        setRecipes(mockRecipes);
      }
      
      showSuccess('Recipe suggestions generated!');
    } catch (error) {
      showError('Failed to generate recipes');
      console.error('Recipe generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIngredients('');
    setCuisine('');
    setCookingTime('');
    setServings('');
    setDietaryRestrictions('');
    setRecipes([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChefHat className="w-5 h-5" />
          <span>Recipe Suggestions</span>
        </CardTitle>
        <CardDescription>
          Get personalized recipe ideas based on your ingredients and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ingredients">Available ingredients *</Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="What ingredients do you have? (e.g., chicken, tomatoes, pasta, garlic)"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cuisine">Cuisine type (optional)</Label>
              <Input
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g., Italian, Asian, Mexican"
              />
            </div>

            <div>
              <Label htmlFor="cooking-time">Max cooking time (optional)</Label>
              <Input
                id="cooking-time"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                placeholder="e.g., 30 minutes, 1 hour"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servings">Number of servings (optional)</Label>
              <Input
                id="servings"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="e.g., 2, 4, 6"
              />
            </div>

            <div>
              <Label htmlFor="dietary-restrictions">Dietary restrictions (optional)</Label>
              <Input
                id="dietary-restrictions"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                placeholder="e.g., vegetarian, gluten-free"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading || aiLoading} className="flex-1">
              {loading ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Generating recipes...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Get Recipe Ideas
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>

        {recipes.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-sm">Suggested Recipes:</h4>
            {recipes.map((recipe, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{recipe}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{cookingTime || '30 min'}</span>
                    <Users className="w-3 h-3" />
                    <span>{servings || '4'}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}