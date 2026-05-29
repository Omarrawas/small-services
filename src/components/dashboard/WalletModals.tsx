import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Wallet, Smartphone, Landmark, CheckCircle2 } from "lucide-react";

interface WalletModalsProps {
  type: "deposit" | "withdraw" | null;
  onClose: () => void;
  onSuccess: () => void;
  balance?: number;
}

export function WalletModals({ type, onClose, onSuccess, balance = 0 }: WalletModalsProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("");
  const [details, setDetails] = useState("");
  const [step, setStep] = useState(1);

  const depositMutation = trpc.wallet.deposit.useMutation({
    onSuccess: () => {
      setStep(3);
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const withdrawMutation = trpc.wallet.withdraw.useMutation({
    onSuccess: () => {
      setStep(3);
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handleSubmit = () => {
    if (!amount || !method) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (type === "deposit") {
      depositMutation.mutate({
        amount,
        method: method as any,
        transactionNumber: details,
      });
    } else {
      if (parseFloat(amount) > balance) {
        toast.error("الرصيد غير كافٍ");
        return;
      }
      withdrawMutation.mutate({
        amount,
        method: method as any,
        accountNumber: details,
      });
    }
  };

  const paymentMethods = [
    { id: "syriatel_cash", name: "سيريتيل كاش", icon: Smartphone, color: "text-red-600", note: "أرسل المبلغ إلى الرقم: 0991234567" },
    { id: "mtn_cash", name: "MTN كاش", icon: Smartphone, color: "text-yellow-600", note: "أرسل المبلغ إلى الرقم: 0941234567" },
    { id: "sham_cash", name: "شام كاش", icon: Wallet, color: "text-blue-600", note: "أرسل المبلغ إلى حساب: 123456" },
  ];

  return (
    <Dialog open={!!type} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl overflow-hidden border-0 shadow-2xl">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {type === "deposit" ? "شحن المحفظة" : "سحب الرصيد"}
              </DialogTitle>
              <DialogDescription className="text-center">
                اختر الطريقة المفضلة وحدد المبلغ
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>طريقة الدفع / السحب</Label>
                <Select onValueChange={setMethod}>
                  <SelectTrigger className="rounded-xl h-12 border-[#E5E5DF]">
                    <SelectValue placeholder="اختر الوسيلة" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.id} value={pm.id}>
                        <div className="flex items-center gap-2">
                          <pm.icon className={`w-4 h-4 ${pm.color}`} />
                          <span>{pm.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {type === "withdraw" && (
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-gray-600" />
                          <span>تحويل بنكي</span>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>المبلغ (ل.س)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl h-12 border-[#E5E5DF] text-lg font-bold"
                />
              </div>

              {method && type === "deposit" && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 italic text-xs text-blue-800">
                  {paymentMethods.find(p => p.id === method)?.note}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-[#0D5D48] hover:bg-[#094533] rounded-xl h-12 font-bold transition-all"
                disabled={!amount || !method}
              >
                الخطوة التالية
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">تأكيد التفاصيل</DialogTitle>
              <DialogDescription>
                {type === "deposit" 
                  ? "أدخل الرقم المرجعي للعملية (الباركود أو رقم التحويل)" 
                  : "أدخل رقم الحساب أو المحفظة التي تريد الاستلام عليها"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label>{type === "deposit" ? "الرقم المرجعي" : "رقم الحساب / الجوال"}</Label>
                <Input
                  placeholder="مثال: 987654321"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="rounded-xl h-12 border-[#E5E5DF]"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500">الإجمالي:</span>
                <span className="font-bold text-[#0D5D48]">{parseFloat(amount).toLocaleString()} ل.س</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-xl">رجوع</Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-[2] bg-[#0D5D48] hover:bg-[#094533] rounded-xl h-12 font-bold"
                disabled={depositMutation.isPending || withdrawMutation.isPending}
              >
                {depositMutation.isPending || withdrawMutation.isPending ? "جاري المعالجة..." : "تأكيد الطلب"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 3 && (
          <div className="py-10 text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A2E]">تم إرسال الطلب بنجاح</h3>
            <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
              سيتم مراجعة طلبك من قبل القائمين على النظام وتغيير حالة الرصيد خلال أقل من 24 ساعة.
            </p>
            <Button onClick={onClose} className="w-full bg-[#0D5D48] rounded-xl h-12 mt-6">إغلاق</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
