"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/schemas/profile";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const crops = [
  { value: "wheat", label: "Wheat" },
  { value: "rice", label: "Rice" },
  { value: "corn", label: "Corn" },
  { value: "soybean", label: "Soybean" },
];

const techniques = [
  { value: "organic", label: "Organic Farming" },
  { value: "permaculture", label: "Permaculture" },
  { value: "hydroponics", label: "Hydroponics" },
  { value: "precision", label: "Precision Agriculture" },
];

export function ProfileForm({ 
  user, 
  onSuccess,
  onCancel
}: { 
  user: any; 
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      location: user.location || "",
      cropsGrown: user.cropsGrown || [],
      farmingTechniques: user.farmingTechniques || [],
      bio: user.bio || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      await onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="E.g., Punjab, India" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="cropsGrown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crops Grown</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full justify-start">
                      {field.value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((value) => (
                            <Badge key={value} variant="secondary">
                              {crops.find((c) => c.value === value)?.label}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "Select crops..."
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-2">
                  <div className="space-y-2">
                    {crops.map((crop) => (
                      <div key={crop.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`crop-${crop.value}`}
                          checked={field.value.includes(crop.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, crop.value])
                              : field.onChange(
                                  field.value.filter((v) => v !== crop.value)
                                );
                          }}
                        />
                        <label htmlFor={`crop-${crop.value}`}>{crop.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="farmingTechniques"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farming Techniques</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full justify-start">
                      {field.value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((value) => (
                            <Badge key={value} variant="secondary">
                              {techniques.find((t) => t.value === value)?.label}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "Select techniques..."
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-2">
                  <div className="space-y-2">
                    {techniques.map((tech) => (
                      <div key={tech.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tech-${tech.value}`}
                          checked={field.value.includes(tech.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, tech.value])
                              : field.onChange(
                                  field.value.filter((v) => v !== tech.value)
                                );
                          }}
                        />
                        <label htmlFor={`tech-${tech.value}`}>{tech.label}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us about your farm..." rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}