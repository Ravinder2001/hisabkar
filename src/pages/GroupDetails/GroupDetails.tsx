/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Users2, Wallet, Receipt, MoreVertical, Plus } from "lucide-react";
import styles from "./style.module.css";
import { Button } from "../../components/ui/button";
import AddExpenseModal from "../../components/AddExpense/AddExpense";

export default function GroupDetails() {
  const groupData = {
    name: "Jan Expense",
    type: "Travel Group",
    totalAmount: 1250.0,
    members: [
      { name: "John Doe", avatar: "https://api.multiavatar.com/123.png", spent: 750.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
      { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", spent: 500.0 },
    ],
    expenses: [
      {
        id: 1,
        title: "Hotel Booking",
        description: "Two nights stay at Marriott Hotel",
        amount: 800.0,
        paidBy: "John Doe",
        paidByAvatar: "https://api.multiavatar.com/123.png",
        date: "2024-01-15",
        participants: [
          { name: "John Doe", avatar: "https://api.multiavatar.com/123.png", amount: 400.0 },
          { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", amount: 400.0 },
        ],
      },
      {
        id: 2,
        title: "Dinner",
        description: "Dinner at Italian Restaurant",
        amount: 200.0,
        paidBy: "Jane Smith",
        paidByAvatar: "https://api.multiavatar.com/123.png",
        date: "2024-01-15",
        participants: [
          { name: "John Doe", avatar: "https://api.multiavatar.com/123.png", amount: 100.0 },
          { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", amount: 100.0 },
        ],
      },
      {
        id: 3,
        title: "Taxi",
        description: "Airport transfer",
        amount: 250.0,
        paidBy: "John Doe",
        paidByAvatar: "https://api.multiavatar.com/123.png",
        date: "2024-01-16",
        participants: [
          { name: "John Doe", avatar: "https://api.multiavatar.com/123.png", amount: 125.0 },
          { name: "Jane Smith", avatar: "https://api.multiavatar.com/123.png", amount: 125.0 },
        ],
      },
    ],
  };

  const [isAddExpModal, setAddExpModal] = useState<boolean>(true);

  const handleExpModal = () => {
    setAddExpModal(!isAddExpModal);
  };

  return (
    <div className="container space-y-6">
      <div className="grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 pb-4">
          <Card className="bg-white p-0">
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="lg:block hidden">Group Details</CardTitle>
              <Accordion type="single" collapsible className="w-full lg:hidden">
                <AccordionItem value="group-details">
                  <AccordionTrigger className="text-xl font-semibold">Group Details</AccordionTrigger>
                  <AccordionContent>
                    <GroupDetailsContent data={groupData} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardHeader>
            <CardContent className="hidden lg:block">
              <GroupDetailsContent data={groupData} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expenses Timeline</CardTitle>
              <Badge variant="outline" className="bg-black text-white">
                Unsettled
              </Badge>
            </CardHeader>
            <CardContent>
              {/* <ScrollArea className="h-[400px] lg:h-[400px]"> */}
              <ExpensesTimeline expenses={groupData.expenses} />
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        </div>
      </div>
      <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-black text-white" onClick={handleExpModal}>
        <Plus className="w-6 h-6" />
      </Button>
      <AddExpenseModal isOpen={isAddExpModal} setIsOpen={setAddExpModal} />
    </div>
  );
}

function GroupDetailsContent({ data }: any) {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-600">{data.name}</h2>
        <button className="hover:bg-gray-100 p-2 rounded-full">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <img src="https://api.multiavatar.com/123.png" alt="Travel Group" className="w-5 h-5" />
        {data.type}
      </div>

      <div className="flex items-center gap-2">
        <Users2 className="h-5 w-5 text-blue-500" />
        <span>{data.members.length} members</span>
        <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-200">
          You&apos;re admin
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-green-500" />
        <span className="text-green-600 font-semibold">₹{data.totalAmount.toFixed(2)}</span>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Members</h3>
        <div className={`${styles.membersCon} space-y-3`}>
          {data.members.map((member: any) => (
            <div key={member.name} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">Spent: ₹{member.spent.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpensesTimeline({ expenses }: any) {
  return (
    <div className={styles.expenseCon}>
      {expenses.map((expense: any, index: number) => (
        <div key={expense.id} className="relative">
          <div className="flex items-start gap-2">
            <div className="relative h-[100%]">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-green-600" />
              </div>
              {index !== expenses.length - 1 && (
                <div className="absolute top-8 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" style={{ height: "calc(100% + 1rem)" }} />
              )}
            </div>
            <div className="flex-1 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{expense.title}</h4>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={expense.paidByAvatar} />
                    <AvatarFallback>{expense.paidBy[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    Paid by <span className="font-medium">{expense.paidBy}</span>
                  </span>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="split-details">
                    <AccordionTrigger className="text-sm font-medium text-gray-700">Split between</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {expense.participants.map((participant: any) => (
                        <div key={participant.name} className="flex items-center justify-between bg-white/50 p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{participant.name}</span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">₹{participant.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
