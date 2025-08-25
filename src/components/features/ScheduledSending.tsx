import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Send, Phone, Mail, MessageSquare } from 'lucide-react';
import { GreetingFormData } from '@/types/greeting';
import { toast } from 'sonner';

interface ScheduledMessage {
  id: string;
  type: 'sms' | 'whatsapp' | 'telegram' | 'email' | 'teams';
  recipient: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'failed';
}

interface ScheduledSendingProps {
  greetingData: GreetingFormData;
  greetingUrl?: string;
}

const ScheduledSending: React.FC<ScheduledSendingProps> = ({ greetingData, greetingUrl }) => {
  const [messageType, setMessageType] = useState<'sms' | 'whatsapp' | 'telegram' | 'email' | 'teams'>('email');
  const [recipient, setRecipient] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);

  const messageTypes = [
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    { id: 'sms', label: 'SMS', icon: <Phone className="h-4 w-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'telegram', label: 'Telegram', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'teams', label: 'Microsoft Teams', icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const getDefaultMessage = () => {
    const baseMessage = `Hi there! I've created a special ${greetingData.eventType} greeting for you.`;
    return greetingUrl 
      ? `${baseMessage} Check it out here: ${greetingUrl}`
      : baseMessage;
  };

  const getPlaceholder = () => {
    switch (messageType) {
      case 'email':
        return 'recipient@email.com';
      case 'sms':
      case 'whatsapp':
        return '+1234567890';
      case 'telegram':
        return '@username or phone number';
      case 'teams':
        return 'username@company.com';
      default:
        return 'Recipient';
    }
  };

  const scheduleMessage = () => {
    if (!recipient || !scheduledDate || !scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMessage: ScheduledMessage = {
      id: Date.now().toString(),
      type: messageType,
      recipient,
      message: customMessage || getDefaultMessage(),
      scheduledDate,
      scheduledTime,
      status: 'pending'
    };

    setScheduledMessages(prev => [...prev, newMessage]);
    toast.success('Message scheduled successfully!');

    // Reset form
    setRecipient('');
    setCustomMessage('');
    setScheduledDate('');
    setScheduledTime('');
  };

  const deleteScheduledMessage = (id: string) => {
    setScheduledMessages(prev => prev.filter(msg => msg.id !== id));
    toast.success('Scheduled message deleted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = messageTypes.find(t => t.id === type);
    return typeConfig?.icon || <MessageSquare className="h-4 w-4" />;
  };

  return (
    <Card className="border border-orange-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-orange-600" />
          Scheduled Sending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message Type Selection */}
        <div className="space-y-2">
          <Label>Message Type</Label>
          <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {messageTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <Label htmlFor="recipient">
            Recipient {messageType === 'email' ? 'Email' : messageType === 'sms' || messageType === 'whatsapp' ? 'Phone Number' : 'Username'}
          </Label>
          <Input
            id="recipient"
            placeholder={getPlaceholder()}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Custom Message (optional)</Label>
          <Textarea
            id="message"
            placeholder={getDefaultMessage()}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={scheduleMessage} className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Message
        </Button>

        {/* Scheduled Messages */}
        {scheduledMessages.length > 0 && (
          <div className="space-y-3">
            <Label>Scheduled Messages</Label>
            <div className="space-y-3">
              {scheduledMessages.map((message) => (
                <Card key={message.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(message.type)}
                          <span className="font-medium">{message.type.toUpperCase()}</span>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div>To: {message.recipient}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {message.scheduledDate}
                            <Clock className="h-3 w-3 ml-2" />
                            {message.scheduledTime}
                          </div>
                        </div>
                        
                        <div className="text-sm bg-gray-50 p-2 rounded">
                          {message.message}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => deleteScheduledMessage(message.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Messages will be sent automatically at the scheduled time</p>
          <p>• Make sure to test your recipient details before scheduling</p>
          <p>• Greeting URL will be automatically included in the message</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledSending;