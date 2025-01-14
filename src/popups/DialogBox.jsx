import { Fragment } from 'react';
// import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CheckCheckIcon , ExclamationTriangleIcon}from 'lucide-react';

export default function DialogBox({
  open,
  setOpen,
  title,
  message,
  ActionButtonName,
  ActionButtonColorRed,
  IconName,
  handleLogic,
  Loading
}) {
  return (
    <>
      {Loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setOpen(false)}></div>
            <div className="relative bg-white rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${IconName ? 'bg-green-100' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {IconName ? (
                      <CheckCheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    ) : (
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md ${ActionButtonColorRed ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'} px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                  onClick={handleLogic}
                >
                  {ActionButtonName}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

{/* <DialogBox Loading={Loading} 
open={openDiologBox}
 IconName={IconName}
  title={'Save changes Permanently'} 
  message={'Are you sure you want to save the changes?'}
    ActionButtonName={'Save Changes'}
     ActionButtonColorRed={false} 
     setOpen={setOpenDiologBox} 
     handleLogic={handleSaveChanges}
  /> */}