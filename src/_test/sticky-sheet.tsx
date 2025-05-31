"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Product Details</SheetTitle>
            <SheetDescription>Review the product information and specifications below.</SheetDescription>
          </SheetHeader>

          {/* Scrollable content area */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground">
                  This is a comprehensive product with multiple features and specifications. The content below
                  demonstrates how the sticky button remains fixed while you scroll through this information.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Advanced functionality with modern design</li>
                  <li>• High-quality materials and construction</li>
                  <li>• User-friendly interface and controls</li>
                  <li>• Energy efficient and environmentally friendly</li>
                  <li>• Compatible with multiple platforms</li>
                  <li>• Comprehensive warranty and support</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span>24" x 18" x 12"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>15.2 lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span>Premium aluminum alloy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span>Space Gray, Silver, Black</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Power:</span>
                    <span>100-240V AC, 50/60Hz</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This product comes with a comprehensive user manual and quick start guide. Installation is
                  straightforward and can be completed in under 30 minutes.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  The manufacturer provides excellent customer support and a 2-year warranty covering all parts and
                  labor. Extended warranty options are also available.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Regular software updates ensure optimal performance and new features are added periodically at no
                  additional cost.
                </p>
                <p className="text-sm text-muted-foreground">
                  For technical support, please visit our website or contact our support team directly. We're here to
                  help with any questions or concerns you may have.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Reviews</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">John D.</span>
                      <span className="text-yellow-500">★★★★★</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Excellent product! Exceeded my expectations in every way. The build quality is outstanding and it
                      works perfectly."
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-yellow-500">★★★★☆</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Very satisfied with this purchase. Easy to set up and use. Would definitely recommend to others."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sticky button at the bottom */}
          <div className="sticky bottom-0 bg-background border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Add to Cart
              </Button>
              <Button className="flex-1">Buy Now</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
