import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { Plus, Package2, Clock, Shield, Search } from "lucide-react";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  dosageForm?: string;
  strength?: string;
  activeIngredients: string[];
  nafdacNumber?: string;
  shelfLifeMonths?: number;
  storageConditions?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ManufacturerProductsProps {
  orgId: string;
}

const ManufacturerProducts = ({ orgId }: ManufacturerProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    dosageForm: "",
    strength: "",
    activeIngredients: "",
    nafdacNumber: "",
    shelfLifeMonths: "",
    storageConditions: ""
  });

  const categories = [
    "Antibiotics",
    "Analgesics", 
    "Antihypertensives",
    "Antidiabetics",
    "Antipyretics",
    "Vitamins & Supplements",
    "Cardiovascular",
    "Respiratory",
    "Gastrointestinal",
    "Dermatological"
  ];

  const dosageForms = [
    "Tablet",
    "Capsule", 
    "Syrup",
    "Injection",
    "Cream",
    "Ointment",
    "Drops",
    "Inhaler",
    "Suspension",
    "Powder"
  ];

  useEffect(() => {
    if (orgId) {
      loadProducts();
    }
  }, [orgId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?organizationId=${orgId}`);
      const data = await res.json();
      
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        toast.error(data.error || "Failed to load products");
      }
    } catch (error) {
      toast.error("Failed to load products");
      console.error("Load products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.description || !newProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          activeIngredients: newProduct.activeIngredients.split(",").map(ingredient => ingredient.trim()),
          shelfLifeMonths: newProduct.shelfLifeMonths ? parseInt(newProduct.shelfLifeMonths) : null,
          organizationId: orgId
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product created successfully");
        setShowCreateDialog(false);
        setNewProduct({
          name: "",
          description: "",
          category: "",
          dosageForm: "",
          strength: "",
          activeIngredients: "",
          nafdacNumber: "",
          shelfLifeMonths: "",
          storageConditions: ""
        });
        loadProducts();
      } else {
        toast.error(data.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("Failed to create product");
      console.error("Create product error:", error);
    } finally {
      setCreating(false);
    }
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.activeIngredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Product Catalog</h1>
        <div className="flex items-center justify-center p-6 sm:p-8">
          <LoadingSpinner size="large" text="Loading products..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your product portfolio</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">New Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Create New Product</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createProduct} className="space-y-3 sm:space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Paracetamol"
                    className="h-10 sm:h-11"
                    required
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description and uses"
                  className="min-h-[80px] sm:min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="dosageForm" className="text-sm font-medium">Dosage Form</Label>
                  <Select 
                    value={newProduct.dosageForm} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, dosageForm: value }))}
                  >
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosageForms.map((form) => (
                        <SelectItem key={form} value={form}>
                          {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="strength" className="text-sm font-medium">Strength</Label>
                  <Input
                    id="strength"
                    value={newProduct.strength}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, strength: e.target.value }))}
                    placeholder="e.g., 500mg"
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="activeIngredients" className="text-sm font-medium">Active Ingredients</Label>
                <Input
                  id="activeIngredients"
                  value={newProduct.activeIngredients}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, activeIngredients: e.target.value }))}
                  placeholder="Separate multiple ingredients with commas"
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="nafdacNumber" className="text-sm font-medium">NAFDAC Number</Label>
                  <Input
                    id="nafdacNumber"
                    value={newProduct.nafdacNumber}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nafdacNumber: e.target.value }))}
                    placeholder="e.g., A4-0123"
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="shelfLifeMonths" className="text-sm font-medium">Shelf Life (Months)</Label>
                  <Input
                    id="shelfLifeMonths"
                    type="number"
                    value={newProduct.shelfLifeMonths}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, shelfLifeMonths: e.target.value }))}
                    placeholder="e.g., 24"
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="storageConditions" className="text-sm font-medium">Storage Conditions</Label>
                <Textarea
                  id="storageConditions"
                  value={newProduct.storageConditions}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, storageConditions: e.target.value }))}
                  placeholder="Storage temperature, humidity requirements, etc."
                  className="min-h-[60px] sm:min-h-[80px] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 sm:space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {creating ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Section */}
      {products.length > 0 && (
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="relative flex-1 max-w-sm sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-11 w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="w-full sm:w-auto h-10 sm:h-11"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6 sm:py-8 px-4">
            <Package2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">Create your first product to get started with your catalog</p>
            <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Your First Product</span>
              <span className="sm:hidden">Add Product</span>
            </Button>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6 sm:py-8 px-4">
            <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all" 
                ? "No products match your current filters. Try adjusting your search terms or category selection."
                : "No products available."
              }
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs sm:text-sm h-8"
              >
                Show All
              </Button>
            )}
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="h-full flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">Category:</span>
                    <Badge variant="secondary" className="text-xs self-start sm:self-auto">
                      {product.category}
                    </Badge>
                  </div>
                  {product.dosageForm && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Form:</span>
                      <span className="text-xs sm:text-sm font-medium">{product.dosageForm}</span>
                    </div>
                  )}
                  {product.strength && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Strength:</span>
                      <span className="text-xs sm:text-sm font-medium">{product.strength}</span>
                    </div>
                  )}
                  {product.nafdacNumber && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">NAFDAC:</span>
                      <span className="text-xs sm:text-sm font-medium font-mono">{product.nafdacNumber}</span>
                    </div>
                  )}
                  {product.shelfLifeMonths && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">Shelf Life:</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-medium">{product.shelfLifeMonths} months</span>
                      </div>
                    </div>
                  )}
                  {product.activeIngredients.length > 0 && (
                    <div className="space-y-1 sm:space-y-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Active Ingredients:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.activeIngredients.slice(0, 3).map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                            {ingredient}
                          </Badge>
                        ))}
                        {product.activeIngredients.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{product.activeIngredients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4 mt-auto border-t">
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <span className="hidden sm:inline">
                      {new Date(product.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date(product.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: '2-digit'
                      })}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default ManufacturerProducts;
