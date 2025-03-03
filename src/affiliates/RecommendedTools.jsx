import React from 'react'
import { FileText} from "lucide-react";

export default function RecommendedTools() {
  return (
    <div>
      {/* Monetization: Affiliate Links - Enhanced styling */}
      <div className="mb-8 sm:p-6 p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#ffffff24] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-600 dark:bg-opacity-20 rounded-full">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-[1rem] md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Recommended Tools
            </h3>
            <p className="text-[0.7rem] sm:text-sm text-gray-600 dark:text-gray-300">
              Learn trading with{' '}
              <a 
                href="https://www.amazon.in/Financial-Statement-Analysis-Handbook-ZebraLearn/dp/8195895077?content-id=amzn1.sym.288d7cd9-bdfb-4778-882a-c15de0f76151%3Aamzn1.sym.288d7cd9-bdfb-4778-882a-c15de0f76151&crid=26ZU6ASO9Q43R&cv_ct_cx=finance+books+50+30+20+rules&keywords=finance+books+50+30+20+rules&pd_rd_i=8195895077&pd_rd_r=7a572262-4405-4d43-886a-a03417a6344a&pd_rd_w=WBfLv&pd_rd_wg=H5eGC&pf_rd_p=288d7cd9-bdfb-4778-882a-c15de0f76151&pf_rd_r=S5JT6B90R0G4X9B0A7XZ&qid=1740588213&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=finance+books+50+30+20+rule%2Caps%2C1988&sr=1-1-9131241a-a358-4619-a7b8-0f5a65d91d81&linkCode=ll1&tag=financegetbys-21&linkId=5428e948533236cb005d4a454e71e7d5&language=en_IN&ref_=as_li_ss_tl" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                top finance books
              </a>{' '}
              or trade smarter with{' '}
              <a 
                href="https://zerodha.com/open-account?c=GRY7344" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Zerodha—free demat + 10% brokerage share
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
