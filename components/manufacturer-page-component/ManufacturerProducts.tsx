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
import { Plus, Package2, Clock, Shield } from "lucide-react";
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-montserrat font-bold text-3xl text-foreground">Product Catalog</h1>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="large" text="Loading products..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground">Manage your product portfolio</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createProduct} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Paracetamol"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description and uses"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosageForm">Dosage Form</Label>
                  <Select 
                    value={newProduct.dosageForm} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, dosageForm: value }))}
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="strength">Strength</Label>
                  <Input
                    id="strength"
                    value={newProduct.strength}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, strength: e.target.value }))}
                    placeholder="e.g., 500mg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeIngredients">Active Ingredients</Label>
                <Input
                  id="activeIngredients"
                  value={newProduct.activeIngredients}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, activeIngredients: e.target.value }))}
                  placeholder="Separate multiple ingredients with commas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nafdacNumber">NAFDAC Number</Label>
                  <Input
                    id="nafdacNumber"
                    value={newProduct.nafdacNumber}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nafdacNumber: e.target.value }))}
                    placeholder="e.g., A4-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shelfLifeMonths">Shelf Life (Months)</Label>
                  <Input
                    id="shelfLifeMonths"
                    type="number"
                    value={newProduct.shelfLifeMonths}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, shelfLifeMonths: e.target.value }))}
                    placeholder="e.g., 24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageConditions">Storage Conditions</Label>
                <Textarea
                  id="storageConditions"
                  value={newProduct.storageConditions}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, storageConditions: e.target.value }))}
                  placeholder="Storage temperature, humidity requirements, etc."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first product to get started</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  {product.dosageForm && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Form:</span>
                      <span className="text-sm font-medium">{product.dosageForm}</span>
                    </div>
                  )}
                  {product.strength && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Strength:</span>
                      <span className="text-sm font-medium">{product.strength}</span>
                    </div>
                  )}
                  {product.nafdacNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">NAFDAC:</span>
                      <span className="text-sm font-medium">{product.nafdacNumber}</span>
                    </div>
                  )}
                  {product.shelfLifeMonths && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Shelf Life:</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm font-medium">{product.shelfLifeMonths} months</span>
                      </div>
                    </div>
                  )}
                  {product.activeIngredients.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Active Ingredients:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.activeIngredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManufacturerProducts;
