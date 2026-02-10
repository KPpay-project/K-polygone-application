import { TourProvider } from '@reactour/tour';
import { TOURSTEPS } from '@/data/tour-data';
import { ReactNode } from 'react';
import Cookies from 'js-cookie';

const tourStyles = {
  popover: (base: any) => ({
    ...base,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    maxWidth: '380px'
  }),
  maskArea: (base: any) => ({
    ...base,
    rx: '8px'
  })
};

const tourComponents = {
  Badge: () => (
    // <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium mb-2">
    //     Step {props.currentStep + 1} of {props.steps?.length || 0}
    // </div>
    <></>
  ),
  Navigation: (props: any) => {
    const totalSteps = props.steps?.length || 0;
    const isLastStep = props.currentStep === totalSteps - 1;

    return (
      <div className="flex flex-col items-center justify-between mt-5 pt-4 border-t">
        <div className="flex gap-1.5">
          {props.steps?.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => props.setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === props.currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <br />
        <div className="flex gap-2">
          <button
            onClick={() => props.setCurrentStep(props.currentStep - 1)}
            disabled={props.currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {!isLastStep ? (
            <button
              onClick={() => props.setCurrentStep(props.currentStep + 1)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                Cookies.set('hasToured', 'true', { expires: 365 });
                props.setIsOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    );
  }
};

interface TourGuildProviderProps {
  children: ReactNode;
}

export const TourGuildProvider = ({ children }: TourGuildProviderProps) => {
  return (
    <TourProvider
      steps={TOURSTEPS}
      disableDotsNavigation={true}
      showDots={false}
      styles={tourStyles}
      components={tourComponents}
      showBadge={true}
      showNavigation={true}
      showCloseButton={false}
      padding={10}
      className="tour-custom"
    >
      {children}
    </TourProvider>
  );
};
