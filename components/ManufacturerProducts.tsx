import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ProductProps } from "@/utils";
// import { mockProducts } from "@/lib/manufacturer-data"
import { dummyProducts } from "@/database";

const ManufacturerProducts = () => {

    const [products, setProducts] = useState<ProductProps[]>(dummyProducts)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Product Catalog</h1>
                    <p className="text-muted-foreground">Manage your product portfolio</p>
                </div>
                <Button onClick={() => alert("Adding new product...")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Category:</span>
                                    <span className="text-sm font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Form:</span>
                                    <span className="text-sm font-medium">{product.dosageForm}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">NAFDAC:</span>
                                    <span className="text-sm font-medium">{product.nafdacNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Shelf Life:</span>
                                    <span className="text-sm font-medium">{product.shelfLifeMonths} months</span>
                                </div>
                                <div className="pt-2">
                                    <Badge variant="outline">{product.strength}</Badge>
                                </div>
                                <div className="pt-2">
                                    <Button size="sm" className="w-full" onClick={() => alert(`Managing ${product.name}...`)}>
                                        Manage Product
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ManufacturerProducts;