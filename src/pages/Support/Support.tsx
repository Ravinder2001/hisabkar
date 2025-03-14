import type React from "react";

import { useState } from "react";
import { LifeBuoy, MessageSquare, Bug, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import SupportModal from "../../components/SupportModal/SupportModal";
import { SupportType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface SupportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SupportCard({ title, description, icon, onClick }: SupportCardProps) {
  return (
    <Card className="transition-all hover:shadow-md bg-gray-50">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <CardDescription className="text-base min-h-[80px]">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick} className="w-full gap-2 group">
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
function Support() {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [supportType, setSupportType] = useState<SupportType>(null);

  const openModal = (type: SupportType) => {
    setSupportType(type);
    setModalOpen(!modalOpen);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose an option below to get assistance, provide feedback, or report an issue with Hisabkar.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-6">
          <SupportCard
            title="Customer Support"
            description="Get help with your account, payments, or general questions"
            icon={<LifeBuoy className="h-10 w-10 text-primary" />}
            onClick={() => openModal("SUPPORT")}
          />

          {isUserLoggedIn ? (
            <SupportCard
              title="Feedback"
              description="Share your thoughts and suggestions to help us improve"
              icon={<MessageSquare className="h-10 w-10 text-primary" />}
              onClick={() => openModal("FEEDBACK")}
            />
          ) : null}
          {isUserLoggedIn ? (
            <SupportCard
              title="Report a Bug"
              description="Let us know if something isn't working correctly"
              icon={<Bug className="h-10 w-10 text-primary" />}
              onClick={() => openModal("BUG")}
            />
          ) : null}
        </div>
      </div>
      {modalOpen ? <SupportModal isOpen={modalOpen} setIsOpen={openModal} supportType={supportType} /> : null}
    </div>
  );
}

export default Support;
