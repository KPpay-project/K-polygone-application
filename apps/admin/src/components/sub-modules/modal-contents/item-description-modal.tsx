import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { ModalSection } from '@/components/ui/modal-section';
import { UserInfoCard } from '@/components/ui/user-info-card';
import { DocumentItem } from '@/components/ui/document-item';
import { ActivityTimeline, type ActivityItem } from '@/components/ui/activity-timeline';

interface SupportingDocument {
  name: string;
  icon: string;
  size?: string;
}

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  status: string;
}

interface GeoLocationInfo {
  ipAddress: string;
  device: string;
  location: string;
}

interface ModalSection {
  title: string;
  content: React.ReactNode;
  show?: boolean;
}

interface ItemDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  userInfo?: UserInfo;
  activities?: {
    title?: string;
    items: ActivityItem[];
  };
  geoLocation?: {
    title?: string;
    data: GeoLocationInfo;
  };
  linkItems?: {
    title?: string;
    items: string[];
    onLinkClick?: (link: string) => void;
  };
  supportingDocuments?: {
    title?: string;
    items: SupportingDocument[];
    onDocumentDelete?: (doc: SupportingDocument, index: number) => void;
  };
  customSections?: ModalSection[];
  width?: string;
  className?: string;
}

const ItemDescriptionModal: React.FC<ItemDescriptionModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  activities,
  geoLocation,
  linkItems,
  supportingDocuments,
  customSections = []
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed right-0 top-0 bottom-0 z-50 w-[509px] h-full bg-white overflow-y-auto p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full rounded-l-lg border-l border-gray-200">
          <div className="flex flex-col items-end gap-8 p-[45px_45px_30px_45px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-0 h-6 w-6 hover:bg-transparent border border-gray-300 rounded-full"
            >
              <X className="h-6 w-6 text-gray-700" />
            </Button>

            <div className="w-full flex flex-col gap-7">
              {userInfo && (
                <UserInfoCard
                  name={userInfo.name}
                  email={userInfo.email}
                  avatar={userInfo.avatar}
                  status={userInfo.status}
                />
              )}

              {activities && (
                <ModalSection title={activities.title || 'Activity Timeline'}>
                  <ActivityTimeline items={activities.items} />
                </ModalSection>
              )}

              {geoLocation && (
                <div className="w-full flex flex-col gap-2">
                  <h3 className="text-sm font-bold leading-[20px] tracking-[-0.28px] text-gray-600">
                    {geoLocation.title || 'Geo-location Info'}
                  </h3>
                  <ul className="text-sm font-normal leading-[20px] tracking-[-0.28px] text-black list-disc pl-5">
                    <li>IP Address: {geoLocation.data.ipAddress}</li>
                    <li>Device/Browser: {geoLocation.data.device}</li>
                    <li>Location: {geoLocation.data.location}</li>
                  </ul>
                </div>
              )}

              {linkItems && (
                <div className="w-full flex flex-col gap-2">
                  <h3 className="text-sm font-bold leading-[20px] tracking-[-0.28px] text-gray-600">
                    {linkItems.title || 'Link Items'}
                  </h3>
                  {linkItems.items.map((link, index) => (
                    <div
                      key={index}
                      className="text-sm font-normal leading-[20px] tracking-[-0.28px] text-blue-600 cursor-pointer hover:underline"
                      onClick={() => linkItems.onLinkClick?.(link)}
                    >
                      {link}
                    </div>
                  ))}
                </div>
              )}

              {supportingDocuments && (
                <ModalSection title={supportingDocuments.title || 'Supporting Documents'}>
                  <div className="flex flex-col gap-2">
                    {supportingDocuments.items.map((doc, index) => (
                      <DocumentItem
                        key={index}
                        name={doc.name}
                        icon={doc.icon}
                        size={doc.size}
                        onDelete={() => supportingDocuments.onDocumentDelete?.(doc, index)}
                      />
                    ))}
                  </div>
                </ModalSection>
              )}
              {customSections.map(
                (section, index) =>
                  section.show !== false && (
                    <div key={index} className="w-full flex flex-col gap-2">
                      <h3 className="text-sm font-bold leading-[20px] tracking-[-0.28px] text-gray-600">
                        {section.title}
                      </h3>
                      <div className="text-sm font-normal leading-[20px] tracking-[-0.28px] text-black">
                        {section.content}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default ItemDescriptionModal;
