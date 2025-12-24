import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, ArrowRight, Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SwagLoadingScreen from "@/components/SwagLoadingScreen";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import vellumLogo from "@/assets/vellum-logo.png";
import printifyLogo from "@/assets/printify-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
const CustomerGifts = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [hobby, setHobby] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [swagResult, setSwagResult] = useState<{
    message: string;
    orderId: string;
    productId: string;
    mockupImages: string[];
  } | null>(null);

  const handleNextStep = () => {
    if (!hobby.trim()) {
      toast.error("Please tell us about your hobby");
      return;
    }
    setStep(2);
  };

  // Helper to convert country name to ISO code
  const getCountryCode = (countryName: string): string => {
    const countryMap: Record<string, string> = {
      "united states": "US",
      "usa": "US",
      "us": "US",
      "canada": "CA",
      "uk": "GB",
      "united kingdom": "GB",
      "australia": "AU",
      "germany": "DE",
      "france": "FR",
      "spain": "ES",
      "italy": "IT",
      "mexico": "MX",
      "brazil": "BR",
      "japan": "JP",
      "china": "CN",
      "india": "IN",
    };
    const normalized = countryName.toLowerCase().trim();
    return countryMap[normalized] || countryName.toUpperCase().slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!streetAddress.trim()) {
      toast.error("Please enter your street address");
      return;
    }
    
    if (!city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    
    if (!zipCode.trim()) {
      toast.error("Please enter your zip/postal code");
      return;
    }
    
    if (!country.trim()) {
      toast.error("Please enter your country");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the Vellum workflow via edge function
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: {
          recipientName: fullName.trim(),
          address1: streetAddress.trim(),
          city: city.trim(),
          stateCode: state.trim(),
          countryCode: getCountryCode(country),
          zipCode: zipCode.trim(),
          hobby: hobby.trim(),
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to create your swag. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Vellum workflow response:", data);

      // Check workflow state
      if (data?.data?.state === "REJECTED") {
        const errorOutput = data.data.outputs?.find((o: any) => o.name === "error");
        toast.error(errorOutput?.value || "The workflow was unable to process your request.");
        setIsLoading(false);
        return;
      }

      // Extract outputs from the workflow response
      const outputs = data?.data?.outputs || [];
      const getOutput = (name: string) => outputs.find((o: any) => o.name === name)?.value;
      console.log("Workflow outputs:", outputs);

      // Extract values directly from outputs
      const message = getOutput("message") || `A personalized item inspired by your love of ${hobby}`;
      const orderId = getOutput("order_id") || "";
      const productId = getOutput("product_id") || "";
      
      // Extract mockup images - they're objects with {type: "STRING", value: "url"}
      const mockupImagesRaw = getOutput("mockup_images") || [];
      const mockupImages: string[] = [];
      if (Array.isArray(mockupImagesRaw)) {
        mockupImagesRaw.forEach((img: any) => {
          // Handle {type: "STRING", value: "url"} format from Vellum
          if (typeof img === 'string') {
            mockupImages.push(img);
          } else if (img?.value && typeof img.value === 'string') {
            mockupImages.push(img.value);
          } else if (img?.src) {
            mockupImages.push(img.src);
          }
        });
      }
      console.log("Parsed mockup images:", mockupImages);

      setSwagResult({
        message,
        orderId,
        productId,
        mockupImages,
      });
      
      toast.success("Your custom swag order is confirmed!");
    } catch (err) {
      console.error("Error submitting order:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSwagResult(null);
    setHobby("");
    setFullName("");
    setEmail("");
    setStreetAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setStep(1);
  };

  return (
    <>
      <Helmet>
        <title>Surprise Drop | Custom Hobby-Based Swag</title>
        <meta
          name="description"
          content="Get personalized swag created just for you based on your hobbies. Free custom merchandise shipped to your door."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        {/* Decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[800px] h-[300px] bg-indigo-800/20 rounded-full blur-3xl rotate-12" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 max-w-xl">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Partner Logos */}
            <TooltipProvider>
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-purple-300/70 text-sm font-medium">Built with</span>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://vellum.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={vellumLogo} alt="Vellum" className="w-10 h-10 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-900">
                    <p className="font-medium">Agent Builder</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://printify.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={printifyLogo} alt="Printify" className="w-full h-full object-cover" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-900">
                    <p className="font-medium">Order/Shipping</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://lovable.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={lovableLogo} alt="Lovable" className="w-full h-full object-cover" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-900">
                    <p className="font-medium">App UI</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
              Surprise Drop
            </h1>
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Share your hobby with our "swag" agent and it'll turn that idea into a custom swag item you'd actually want.
            </p>
          </div>

          {/* Main Form / Result */}
          {isLoading ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/20">
              <CardContent className="p-8">
                <SwagLoadingScreen />
              </CardContent>
            </Card>
          ) : !swagResult ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/20">
              <CardContent className="p-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hobby" className="text-white text-base">
                        What's your favorite hobby or passion?
                      </Label>
                      <Textarea
                        id="hobby"
                        placeholder="e.g., I love rock climbing on weekends and collect vintage vinyl records..."
                        value={hobby}
                        onChange={(e) => setHobby(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px] focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!hobby.trim()}
                      className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-semibold py-6 text-lg rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/25"
                    >
                      Continue to Shipping
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hobby summary */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-purple-300/70 uppercase tracking-wide mb-1">Your Hobby</p>
                      <p className="text-white text-sm">{hobby}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white text-sm">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white text-sm">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streetAddress" className="text-white text-sm">
                        Street Address *
                      </Label>
                      <Input
                        id="streetAddress"
                        placeholder="123 Main Street, Apt 4B"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white text-sm">
                          City *
                        </Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white text-sm">
                          State
                        </Label>
                        <Input
                          id="state"
                          placeholder="CA"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-white text-sm">
                          Zip Code *
                        </Label>
                        <Input
                          id="zipCode"
                          placeholder="94102"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-white text-sm">
                          Country *
                        </Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:ring-fuchsia-400/20"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !fullName.trim() || !email.trim() || !streetAddress.trim() || !city.trim() || !zipCode.trim() || !country.trim()}
                      className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-semibold py-6 text-lg rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/25"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Your Swag...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Create My Custom Swag
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fuchsia-500/30 flex items-center justify-center">
                    <Package className="w-6 h-6 text-fuchsia-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Swag is Being Created!</h2>
                    <p className="text-purple-300/70 text-sm">Order confirmed • Shipping to your address</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Mockup Images */}
                  {swagResult.mockupImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {swagResult.mockupImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                          <img 
                            src={img} 
                            alt={`Product mockup ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message */}
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-purple-200/80 leading-relaxed whitespace-pre-line">{swagResult.message}</p>
                  </div>

                  {/* Order Details */}
                  {swagResult.orderId && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
                      <Truck className="w-6 h-6 text-fuchsia-400" />
                      <div>
                        <p className="font-medium text-white">Order ID</p>
                        <p className="text-sm text-fuchsia-300 font-mono">{swagResult.orderId}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <p className="text-purple-300/70 text-sm">
                      We'll send you a confirmation email with tracking details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-purple-300/50 text-sm">
              Built with ❤️ by Vellum • All swag is 100% free for our customers
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerGifts;
