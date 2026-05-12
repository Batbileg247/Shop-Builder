import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Separator } from "@/ui/separator";

export const Questions = () => {
  return (
    <div className="flex flex-col gap-10 mt-20 ">
      <div className="flex justify-center text-4xl text-indigo-50 font-semibold">
        Frequently Asked Questions
      </div>
      <Accordion type="single" collapsible className="min-w-4xl ">
        <AccordionItem value="payment">
          <AccordionTrigger className="">Payment integrations</AccordionTrigger>
          <AccordionContent>
            Yes, depending on your selected plan, you can connect various
            payment methods and loan apps.
          </AccordionContent>
        </AccordionItem>
        <Separator className="bg-gray-800" />
        <AccordionItem value="contact">
          <AccordionTrigger>How can I contact?</AccordionTrigger>
          <AccordionContent>
            You can reach our sales team at 8811-1426.
          </AccordionContent>
        </AccordionItem>
        <Separator className="bg-gray-800" />
        <AccordionItem value="doWhat">
          <AccordionTrigger>What does your company do?</AccordionTrigger>
          <AccordionContent>
            We provide ready-made website templates that allow you to easily
            create your own online store.
          </AccordionContent>
        </AccordionItem>
        <Separator className="bg-gray-800" />
        <AccordionItem value="support">
          <AccordionTrigger>
            Will you provide guidance on adding products ?
          </AccordionTrigger>
          <AccordionContent>
            Yes, during your first month, a manager will assist you with
            training and onboarding.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
