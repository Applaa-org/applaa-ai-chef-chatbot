import { useState } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAiChef } from '@/hooks/useAiChef';
import { showSuccess, showError } from '@/utils/toast';

export function IngredientSubstitution() {
  const [ingredient, setIngredient] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [substitution, setSubstitution] = useState<{
    substitution: string;
    ratio: string;
    notes: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { getSubstitution } = useAiChef();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredient.trim()) return;

    setLoading(true);
    try {
      const result = await getSubstitution(
        ingredient,
        dietaryRestrictions ? dietaryRestrictions.split(',').map(s => s.trim()) : undefined,
        availableIngredients ? availableIngredients.split(',').map(s => s.trim()) : undefined
      );
      setSubstitution(result);
      showSuccess('Substitution found!');
    } catch (error) {
      showError('Failed to find substitution');
      console.error('Substitution error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIngredient('');
    setDietaryRestrictions('');
    setAvailableIngredients('');
    setSubstitution(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5" />
          <span>Ingredient Substitution</span>
        </CardTitle>
        <CardDescription>
          Find the perfect substitute for any ingredient based on your dietary needs and available items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ingredient">Ingredient to substitute *</Label>
            <Input
              id="ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g., eggs, butter, flour"
              required
            />
          </div>

          <div>
            <Label htmlFor="dietary-restrictions">Dietary restrictions (optional)</Label>
            <Input
              id="dietary-restrictions"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g., vegan, gluten-free, dairy-free"
            />
          </div>

          <div>
            <Label htmlFor="available-ingredients">Available ingredients (optional)</Label>
            <Textarea
              id="available-ingredients"
              value={availableIngredients}
              onChange={(e) => setAvailableIngredients(e.target.value)}
              placeholder="List ingredients you have available, separated by commas"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Finding substitution...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Substitution
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>

        {substitution && (
          <Alert className="mt-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <div className="mt-2 space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Substitution:</h4>
                  <Badge variant="secondary" className="text-sm">
                    {substitution.substitution}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Ratio:</h4>
                  <p className="text-sm text-gray-600">{substitution.ratio}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600">{substitution.notes}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}