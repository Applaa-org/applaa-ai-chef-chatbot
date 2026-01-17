import { MadeWithApplaa } from "@/components/made-with-applaa";
import { ChefChat } from "@/components/ChefChat";
import { IngredientSubstitution } from "@/components/IngredientSubstitution";
import { RecipeSuggestions } from "@/components/RecipeSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, RefreshCw, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              AI Chef Assistant
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your intelligent cooking companion for recipes, ingredient substitutions, and culinary advice
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <ChefHat className="w-4 h-4" />
                <span>AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="substitution" className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Substitutions</span>
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Recipes</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat">
              <ChefChat />
            </TabsContent>
            
            <TabsContent value="substitution">
              <IngredientSubstitution />
            </TabsContent>
            
            <TabsContent value="recipes">
              <RecipeSuggestions />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by advanced AI to help you cook smarter, not harder
          </p>
        </div>
      </div>
      <MadeWithApplaa />
    </div>
  );
};

export default Index;