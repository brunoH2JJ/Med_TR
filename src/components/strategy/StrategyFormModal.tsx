
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Strategy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface StrategyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy?: Strategy;
  onSave: (strategy: Partial<Strategy>) => void;
}

export function StrategyFormModal({ 
  open, 
  onOpenChange, 
  strategy, 
  onSave 
}: StrategyFormModalProps) {
  const isEditing = !!strategy;
  
  const [formData, setFormData] = useState<Partial<Strategy>>(
    strategy || {
      name: "",
      description: "",
      riskRewardRatio: 2,
      rules: [],
      entryConditions: [],
      exitConditions: [],
      markets: [],
      timeframes: [],
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof Strategy) => {
    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleRiskRewardChange = (value: string) => {
    setFormData((prev) => ({ ...prev, riskRewardRatio: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Strategy name is required",
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Strategy" : "Create New Strategy"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your trading strategy details below." 
              : "Define a new trading strategy by filling out the details below."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Strategy Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter strategy name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your strategy"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="riskRewardRatio">Risk/Reward Ratio</Label>
              <Select 
                value={String(formData.riskRewardRatio)} 
                onValueChange={handleRiskRewardChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1:1</SelectItem>
                  <SelectItem value="2">1:2</SelectItem>
                  <SelectItem value="3">1:3</SelectItem>
                  <SelectItem value="4">1:4</SelectItem>
                  <SelectItem value="5">1:5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rules">Trading Rules</Label>
              <Textarea
                id="rules"
                value={(formData.rules || []).join('\n')}
                onChange={(e) => handleListChange(e, 'rules')}
                placeholder="Enter each rule on a new line"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="entryConditions">Entry Conditions</Label>
              <Textarea
                id="entryConditions"
                value={(formData.entryConditions || []).join('\n')}
                onChange={(e) => handleListChange(e, 'entryConditions')}
                placeholder="Enter each entry condition on a new line"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="exitConditions">Exit Conditions</Label>
              <Textarea
                id="exitConditions"
                value={(formData.exitConditions || []).join('\n')}
                onChange={(e) => handleListChange(e, 'exitConditions')}
                placeholder="Enter each exit condition on a new line"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="markets">Markets</Label>
              <Textarea
                id="markets"
                value={(formData.markets || []).join('\n')}
                onChange={(e) => handleListChange(e, 'markets')}
                placeholder="Enter each market on a new line (e.g., Forex, Stocks)"
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="timeframes">Timeframes</Label>
              <Textarea
                id="timeframes"
                value={(formData.timeframes || []).join('\n')}
                onChange={(e) => handleListChange(e, 'timeframes')}
                placeholder="Enter each timeframe on a new line (e.g., 1H, 4H, Daily)"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Check className="h-4 w-4 mr-2" />
              {isEditing ? "Update Strategy" : "Create Strategy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
