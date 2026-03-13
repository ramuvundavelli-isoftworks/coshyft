import svgPaths from "./svg-kr2bmfuqgi";

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Kaisei_Decol:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#101828] text-[42px] top-0 tracking-[0.0703px]">{`Good morning, Alex! `}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] top-[-0.5px] tracking-[-0.3125px]">You have 3 upcoming rides this week. Keep up the great work reducing emissions!</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[593.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[119.102px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[75.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6.5px] tracking-[-0.1504px]">Offer Ride</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[113.281px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[72.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6.5px] tracking-[-0.1504px]">Find Ride</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-black flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[86.5px] not-italic text-[14px] text-center text-white top-[6.5px] tracking-[-0.1504px]">Log Commute</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[48px] relative shrink-0 w-[391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button />
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <Container2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 10">
            <path d={svgPaths.p23446d60} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_8.33%_29.17%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
            <path d={svgPaths.p363b7770} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#dcfce7] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[68.336px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">CO₂ Saved</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[36px] relative shrink-0 w-[279.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container8 />
        <Text />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[36px] tracking-[0.3955px] whitespace-pre-wrap">21.3 kg</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Lifetime: 287.5 kg</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[36px] items-start pl-[21px] pr-px py-[21px] relative size-full">
        <Container7 />
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 10">
            <path d={svgPaths.p171d6b00} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[62.5%_62.5%_20.83%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
            <path d={svgPaths.p29efb800} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_37.5%_29.17%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 1.66667">
            <path d="M0.833333 0.833333H5.83333" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[62.5%_20.83%_20.83%_62.5%]" data-name="Vector">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
            <path d={svgPaths.p29efb800} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Carpools</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[36px] relative shrink-0 w-[279.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container11 />
        <Text1 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[36px] tracking-[0.3955px] whitespace-pre-wrap">12</p>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">this month</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[36px] items-start pl-[21px] pr-px py-[21px] relative size-full">
        <Container10 />
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[53.71%_29.17%_8.34%_29.18%]" data-name="Vector">
        <div className="absolute inset-[-10.98%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99733 9.25791">
            <path d={svgPaths.p3b346300} id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.p1fad7000} id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#fef3c6] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[91.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Reward Points</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[36px] relative shrink-0 w-[279.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container14 />
        <Text2 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[36px] tracking-[0.3955px] whitespace-pre-wrap">348</p>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">points earned</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[36px] items-start pl-[21px] pr-px py-[21px] relative size-full">
        <Container13 />
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
            <path d={svgPaths.p2220ad80} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#d0fae5] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[80.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Participation</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[36px] relative shrink-0 w-[279.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container17 />
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[36px] tracking-[0.3955px] whitespace-pre-wrap">92%</p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[279.25px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Target: 80% days</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[36px] items-start pl-[21px] pr-px py-[21px] relative size-full">
        <Container16 />
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[198px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container9 />
      <Container12 />
      <Container15 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-[104.711px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-0 tracking-[-0.4395px]">{`Today's Ride`}</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#00bc7d] h-[22px] relative rounded-[8px] shrink-0 w-[53.977px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white">Active</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Text4 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center px-[24px] py-[16px] relative w-full">
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p38e6dc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p298d6480} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 17H15" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p29835400} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[#096] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[27px] relative shrink-0 w-[168.102px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[0.5px] tracking-[-0.4395px]">{`You're driving today`}</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[95.703px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">3 passengers</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[8px] h-[27px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Text5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_777)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_4_777">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[122.336px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">8:30 AM departure</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text6 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[194.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Downtown → Tech Park Office</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text7 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[48px] items-start relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] h-[83px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[16px] h-[83px] items-start relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px]">Passengers</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[169px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#096] text-[18px] top-[0.5px] tracking-[-0.1504px]">12.5 kg CO₂ saved</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[523.266px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col h-[41px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Container32 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#096] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px]">Start Trip</p>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[-0.1504px]">View Details</p>
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[12px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start px-[24px] relative size-full">
        <Container24 />
        <Container31 />
        <Container33 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[316px] items-start p-px relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(158.87deg, rgb(236, 253, 245) 0%, rgb(255, 255, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container21 />
      <Container23 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-[137.422px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px]">Upcoming Rides</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[92.766px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[46px] not-italic text-[#155dfc] text-[14px] text-center top-[6.5px] tracking-[-0.1504px]">View All →</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading1 />
        <Link />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute bg-[#fff7ed] border border-[#ffd6a8] border-solid h-[22px] left-0 overflow-clip rounded-[8px] top-[2.5px] w-[64.898px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[8px] not-italic text-[#ca3500] text-[12px] top-[3px]">pending</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[24px] left-0 top-[32.5px] w-[112.711px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px]">John Employee</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[56.5px] relative shrink-0 w-[112.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text10 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[56.5px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[683.953px] relative size-full">
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_23_753)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_23_753">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[63.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[16px] not-italic text-[#4a5565] text-[12px] top-px">5:30 AM</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[178.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[16px] not-italic text-[#4a5565] text-[12px] top-px">Westside → Tech Park Office</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex gap-[16px] h-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">Sarah Johnson</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[16px] relative shrink-0 w-[105.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#00a63e] text-[12px] top-px">+2.8 kg CO₂ saved</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[#eff6ff] h-[22px] relative rounded-[8px] shrink-0 w-[76.93px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#1447e6] text-[12px]">confirmed</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex h-[35px] items-center justify-between pt-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <Text13 />
      <Text14 />
    </div>
  );
}

function Container36() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[10px] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container37 />
        <Container39 />
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-white h-[323.5px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[48px] items-start p-[25px] relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[663.5px] items-end justify-between min-h-px min-w-px relative" data-name="Container">
      <Container20 />
      <Container34 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p145ec80} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p548e880} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-[167.031px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px]">Your Carbon Impact</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[28px] relative shrink-0 w-[378.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon12 />
        <Heading4 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[40px] left-0 not-italic text-[#00a63e] text-[36px] top-[0.5px] tracking-[0.3691px]">142.5 kg</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">CO₂ saved this month</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[378.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[72.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">Monthly goal</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[38.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#00a63e] text-[12px] top-px">160 kg</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Container48() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[#b9f8cf] content-stretch flex flex-col h-[8px] items-start overflow-clip pl-[-41.617px] pr-[41.617px] relative rounded-[16777200px] shrink-0 w-full" data-name="Primitive.div">
      <Container48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[32px] relative shrink-0 w-[378.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container47 />
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[92.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px">Trees equivalent</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[16px] relative shrink-0 w-[39.836px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px">7 trees</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text17 />
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[86px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px">Distance saved</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[16px] relative shrink-0 w-[43.898px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-px">385 km</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex h-[16px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text19 />
      <Text20 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[40px] relative shrink-0 w-[378.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container50 />
        <Container51 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[378.336px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#7bf1a8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[-0.1504px]">View Full Report</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[410px] relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(136.253deg, rgb(236, 253, 245) 0%, rgb(255, 255, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[40px] items-start pl-[25px] pr-px py-[25px] relative size-full">
        <Container44 />
        <Container45 />
        <Container46 />
        <Container49 />
        <Button5 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p3ceb9d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p3fb33600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-gradient-to-r from-[#096] h-[76px] relative rounded-[16777200px] shrink-0 to-[#00bc7d] w-[378px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[16px] relative size-full">
        <Icon13 />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] not-italic relative shrink-0 text-[27px] text-center text-white tracking-[-0.4395px]">Green Champion!</p>
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[378.336px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[32px] left-[189.36px] not-italic text-[20px] text-center text-white top-[0.5px]">
          {`You're in the top 10% of drivers`}
          <br aria-hidden="true" />
          saving CO₂ this month
        </p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[225px] relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(152.288deg, rgb(10, 10, 10) 0%, rgb(0, 153, 102) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#fff085] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[25px] py-[37px] relative size-full">
        <Container53 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[428.336px]" data-name="Container">
      <Container43 />
      <Container52 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container42 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#101828] text-[18px] top-0 tracking-[-0.4395px]">Monthly Commute Pattern</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">February 2026</p>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[48px] relative shrink-0 w-[221.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading5 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[121.9px] not-italic text-[#00a63e] text-[24px] text-right top-0 tracking-[0.0703px]">43.0 kg</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[122px] not-italic text-[#4a5565] text-[12px] text-right top-px">CO₂ saved this month</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[48px] relative shrink-0 w-[121.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph14 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container56 />
        <Container57 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[40.17px] not-italic text-[#6a7282] text-[12px] text-center top-px">Sun</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[40.24px] not-italic text-[#6a7282] text-[12px] text-center top-px">Mon</p>
    </div>
  );
}

function Container62() {
  return (
    <div className="col-3 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[40.21px] not-italic text-[#6a7282] text-[12px] text-center top-px">Tue</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="col-4 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[39.92px] not-italic text-[#6a7282] text-[12px] text-center top-px">Wed</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="col-5 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[40.19px] not-italic text-[#6a7282] text-[12px] text-center top-px">Thu</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="col-6 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[39.8px] not-italic text-[#6a7282] text-[12px] text-center top-px">Fri</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="col-7 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[40.2px] not-italic text-[#6a7282] text-[12px] text-center top-px">Sat</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[16px] relative shrink-0 w-full" data-name="Container">
      <Container60 />
      <Container61 />
      <Container62 />
      <Container63 />
      <Container64 />
      <Container65 />
      <Container66 />
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[16px] relative shrink-0 w-[5.57px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">1</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="bg-[#f9fafb] col-1 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text21 />
        </div>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.242px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">2</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-[#f9fafb] col-2 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text22 />
        </div>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.695px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">3</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="bg-[#00c950] col-3 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon14 />
      <Text23 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.898px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">4</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="bg-[#00c950] col-4 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon15 />
      <Text24 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 4V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 4V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.4" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa325f00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p48c6d00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 12H9.33333" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13f3cc20} id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.602px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">5</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="bg-[#2b7fff] col-5 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon16 />
      <Text25 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">6</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[#00c950] col-6 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon17 />
      <Text26 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[16px] relative shrink-0 w-[6.977px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">7</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="bg-[#99a1af] col-7 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon18 />
      <Text27 />
    </div>
  );
}

function Container68() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container69 />
      <Container70 />
      <Container71 />
      <Container72 />
      <Container73 />
      <Container74 />
      <Container75 />
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">8</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="bg-[#f9fafb] col-1 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text28 />
        </div>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[16px] relative shrink-0 w-[7.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">9</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-[#99a1af] col-2 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon19 />
      <Text29 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.539px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">10</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="bg-[#00c950] col-3 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon20 />
      <Text30 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p20012900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ad6c100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p12fdd280} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pf491d00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[16px] relative shrink-0 w-[11.523px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">11</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="bg-[#00bba7] col-4 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon21 />
      <Text31 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">12</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="bg-[#00c950] col-5 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon22 />
      <Text32 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 4V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 4V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.4" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa325f00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p48c6d00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 12H9.33333" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13f3cc20} id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">13</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="bg-[#2b7fff] col-6 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon23 />
      <Text33 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p270c3400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p90de340} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 11.3333H10" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p38e3c580} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">14</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="bg-[#ff8904] col-7 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon24 />
      <Text34 />
    </div>
  );
}

function Container76() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container77 />
      <Container78 />
      <Container79 />
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">15</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-center justify-center justify-self-stretch p-px relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text35 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text36() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">16</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="bg-[#99a1af] col-2 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon25 />
      <Text36 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">17</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="bg-[#00c950] col-3 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon26 />
      <Text37 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text38() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.648px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">18</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-[#00c950] col-4 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon27 />
      <Text38 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p102ec180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p29057c70} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H13.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text39() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">19</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="bg-[#ad46ff] col-5 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon28 />
      <Text39 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 4V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 4V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.4" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa325f00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p48c6d00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 12H9.33333" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13f3cc20} id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text40() {
  return (
    <div className="h-[16px] relative shrink-0 w-[15.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">20</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="bg-[#2b7fff] col-6 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon29 />
      <Text40 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p20012900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ad6c100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p12fdd280} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pf491d00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text41() {
  return (
    <div className="h-[16px] relative shrink-0 w-[13.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px">21</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="bg-[#00bba7] col-7 content-stretch flex flex-col gap-[2px] items-center justify-center justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <Icon30 />
      <Text41 />
    </div>
  );
}

function Container84() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container85 />
      <Container86 />
      <Container87 />
      <Container88 />
      <Container89 />
      <Container90 />
      <Container91 />
    </div>
  );
}

function Text42() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">22</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-center justify-center justify-self-stretch p-px relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text42 />
    </div>
  );
}

function Text43() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">23</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="bg-[#f9fafb] col-2 content-stretch flex items-center justify-center justify-self-stretch p-px relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text43 />
    </div>
  );
}

function Text44() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.789px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">24</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="bg-[#f9fafb] col-3 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text44 />
        </div>
      </div>
    </div>
  );
}

function Text45() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">25</p>
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="bg-[#f9fafb] col-4 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text45 />
        </div>
      </div>
    </div>
  );
}

function Text46() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.883px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">26</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="bg-[#f9fafb] col-5 justify-self-stretch relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-px pr-[1.008px] py-px relative size-full">
          <Text46 />
        </div>
      </div>
    </div>
  );
}

function Text47() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">27</p>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="bg-[#f9fafb] col-6 content-stretch flex items-center justify-center justify-self-stretch p-px relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text47 />
    </div>
  );
}

function Text48() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.906px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-px">28</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="bg-[#f9fafb] col-7 content-stretch flex items-center justify-center justify-self-stretch p-px relative rounded-[4px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Text48 />
    </div>
  );
}

function Container92() {
  return (
    <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container93 />
      <Container94 />
      <Container95 />
      <Container96 />
      <Container97 />
      <Container98 />
      <Container99 />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container68 />
      <Container76 />
      <Container84 />
      <Container92 />
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative w-full">
        <Container59 />
        <Container67 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#364153] text-[12px] top-[8px]">Commute Modes</p>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container103() {
  return (
    <div className="bg-[#00c950] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Carpool</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">7 days</p>
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[32px] relative shrink-0 w-[45.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="col-1 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container103 />
      <Container104 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p270c3400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p90de340} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 11.3333H10" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p38e3c580} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container106() {
  return (
    <div className="bg-[#ff8904] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Drive Alone</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">1 days</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[32px] relative shrink-0 w-[66.273px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph19 />
        <Paragraph20 />
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="col-2 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container106 />
      <Container107 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 4V8" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 4V8" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.4" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa325f00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p48c6d00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 12H9.33333" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13f3cc20} id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container109() {
  return (
    <div className="bg-[#2b7fff] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Public Transit</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">3 days</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[32px] relative shrink-0 w-[78.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph21 />
        <Paragraph22 />
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="col-3 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container109 />
      <Container110 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p20012900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ad6c100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p12fdd280} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pf491d00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container112() {
  return (
    <div className="bg-[#00bba7] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Bike</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">2 days</p>
    </div>
  );
}

function Container113() {
  return (
    <div className="h-[32px] relative shrink-0 w-[37px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph23 />
        <Paragraph24 />
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="col-1 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-2 self-stretch shrink-0" data-name="Container">
      <Container112 />
      <Container113 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p102ec180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p29057c70} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H13.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container115() {
  return (
    <div className="bg-[#ad46ff] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Walk</p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">1 days</p>
    </div>
  );
}

function Container116() {
  return (
    <div className="h-[32px] relative shrink-0 w-[35.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph25 />
        <Paragraph26 />
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div className="col-2 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-2 self-stretch shrink-0" data-name="Container">
      <Container115 />
      <Container116 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container118() {
  return (
    <div className="bg-[#99a1af] relative rounded-[4px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#101828] text-[12px] top-px">Work from Home</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] top-px">3 days</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="h-[32px] relative shrink-0 w-[97.445px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph27 />
        <Paragraph28 />
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="col-3 content-stretch flex gap-[8px] items-center justify-self-stretch relative row-2 self-stretch shrink-0" data-name="Container">
      <Container118 />
      <Container119 />
    </div>
  );
}

function Container101() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] h-[76px] relative shrink-0 w-full" data-name="Container">
      <Container102 />
      <Container105 />
      <Container108 />
      <Container111 />
      <Container114 />
      <Container117 />
    </div>
  );
}

function Container100() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative w-full">
        <Paragraph16 />
        <Container101 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[29px] items-start p-[25px] relative rounded-[14px] shrink-0 w-[504px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container55 />
      <Container58 />
      <Container100 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 2">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[#101828] text-[18px] tracking-[-0.4395px]">Your Monthly Impact</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[2%_0.39%_14%_5.07%]" data-name="Group">
      <div className="absolute inset-[-0.17%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 620.209 288.28">
          <g id="Group">
            <path d="M0 287.78H620.209" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 215.96H620.209" id="Vector_2" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 144.14H620.209" id="Vector_3" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 72.32H620.209" id="Vector_4" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 0.5H620.209" id="Vector_5" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[2%_0.39%_14%_5.07%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 621.209 287.28">
        <g id="Group">
          <path d="M0.5 0V287.28" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          <path d="M207.236 0V287.28" id="Vector_2" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          <path d="M413.973 0V287.28" id="Vector_3" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          <path d="M620.709 0V287.28" id="Vector_4" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[2%_0.39%_14%_5.07%]" data-name="Group">
      <Group1 />
      <Group2 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[86%_88.72%_-5.81%_3.47%]" data-name="Group">
      <div className="absolute inset-[86%_92.63%_11.6%_7.37%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 8.208">
            <path d="M0.5 8.208V0" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.81%_88.72%_-5.81%_3.47%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-center whitespace-pre-wrap">Week 1</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[86%_56.25%_-5.81%_34.94%]" data-name="Group">
      <div className="absolute inset-[86%_60.65%_11.6%_39.35%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 8.208">
            <path d="M0.5 8.208V0" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.81%_56.25%_-5.81%_34.94%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-center whitespace-pre-wrap">Week 2</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[86%_25.46%_-5.81%_66.42%]" data-name="Group">
      <div className="absolute inset-[86%_29.52%_11.6%_70.48%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 8.208">
            <path d="M0.5 8.208V0" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.81%_25.46%_-5.81%_66.42%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-center whitespace-pre-wrap">Week 3</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[86%_0.39%_-5.81%_90.7%]" data-name="Group">
      <div className="absolute inset-[86%_0.39%_11.6%_99.61%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 8.208">
            <path d="M0.5 8.208V0" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.81%_0.55%_-5.81%_90.7%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-center whitespace-pre-wrap">Week 4</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[86%_0.39%_-5.81%_3.47%]" data-name="Group">
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[86%_0.39%_-5.81%_3.47%]" data-name="Group">
      <div className="absolute inset-[86%_0.39%_14%_5.07%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 620.209 1">
            <path d="M0 0.5H620.209" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <Group4 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[82.9%_94.93%_11.1%_3.82%]" data-name="Group">
      <div className="absolute inset-[86%_94.93%_14%_4.6%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.06781 1">
            <path d="M0 0.5H3.06781" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[82.9%_95.56%_11.1%_3.82%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-right whitespace-pre-wrap">0</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[61.9%_94.93%_32.1%_3.82%]" data-name="Group">
      <div className="absolute inset-[65%_94.93%_35%_4.6%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.06781 1">
            <path d="M0 0.5H3.06781" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[61.9%_95.56%_32.1%_3.82%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-right whitespace-pre-wrap">6</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[40.9%_94.93%_47.1%_3.43%]" data-name="Group">
      <div className="absolute inset-[44%_94.93%_56%_4.6%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.06781 1">
            <path d="M0 0.5H3.06781" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[40.9%_95.56%_47.1%_3.43%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-right whitespace-pre-wrap">12</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[19.9%_94.93%_68.1%_3.43%]" data-name="Group">
      <div className="absolute inset-[23%_94.93%_77%_4.6%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.06781 1">
            <path d="M0 0.5H3.06781" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[19.9%_95.56%_68.1%_3.43%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-right whitespace-pre-wrap">18</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[1.7%_94.93%_86.3%_3.27%]" data-name="Group">
      <div className="absolute inset-[2%_94.93%_98%_4.6%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.06781 1">
            <path d="M0 0.5H3.06781" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[1.7%_95.56%_86.3%_3.27%] leading-[normal] not-italic text-[#6b7280] text-[12px] text-right whitespace-pre-wrap">24</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[1.7%_94.93%_11.1%_3.27%]" data-name="Group">
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[1.7%_94.93%_11.1%_0.18%]" data-name="Group">
      <div className="absolute inset-[2%_94.93%_14%_5.07%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 287.28">
            <path d="M0.5 0V287.28" id="Vector" stroke="var(--stroke-0, #6B7280)" />
          </svg>
        </div>
      </div>
      <Group10 />
      <div className="absolute flex inset-[28%_98.65%_56%_0.18%] items-center justify-center">
        <div className="-rotate-90 flex-none h-[7.67px] w-[54.72px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative size-full text-[#808080] text-[12px] whitespace-pre-wrap">kg CO₂</p>
        </div>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[10.25%_0.16%_56.55%_4.83%]" data-name="Group">
      <div className="absolute inset-[-1.32%_-0.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 626.277 116.544">
          <g id="Group">
            <path d={svgPaths.p1cf1d300} id="Vector" stroke="var(--stroke-0, #10B981)" strokeWidth="3" />
            <g id="Group_2">
              <path d={svgPaths.pa7d4b00} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #10B981)" strokeWidth="3" />
              <path d={svgPaths.p130cb480} fill="var(--fill-0, white)" id="Vector_3" stroke="var(--stroke-0, #10B981)" strokeWidth="3" />
              <path d={svgPaths.p1f089400} fill="var(--fill-0, white)" id="Vector_4" stroke="var(--stroke-0, #10B981)" strokeWidth="3" />
              <path d={svgPaths.p14f94d00} fill="var(--fill-0, white)" id="Vector_5" stroke="var(--stroke-0, #10B981)" strokeWidth="3" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Surface() {
  return (
    <div className="absolute h-[342px] left-[-0.5px] overflow-clip top-[0.5px] w-[656px]" data-name="Surface">
      <Group />
      <Group3 />
      <Group9 />
      <Group16 />
    </div>
  );
}

function LineChart() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="LineChart">
      <Surface />
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#016630] text-[0px] text-[14px] top-[0.5px] tracking-[-0.1504px]">
        <span className="leading-[20px]">Great job!</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px]">{` You've saved 21.3 kg CO₂ this month, equivalent to planting 1.2 trees.`}</span>
      </p>
    </div>
  );
}

function Container121() {
  return (
    <div className="bg-[#f0fdf4] h-[54px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Paragraph29 />
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[37px] items-start p-[40px] relative rounded-[14px] self-stretch shrink-0 w-[735px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading6 />
      <LineChart />
      <Container121 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[28px] items-start justify-center relative shrink-0 w-full">
      <Container54 />
      <Container120 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3dc17b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pca10000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container125() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[48px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 188, 125) 0%, rgb(0, 166, 62) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Text49() {
  return (
    <div className="absolute bg-[#fff7ed] h-[22px] left-[323.84px] rounded-[8px] top-[2.5px] w-[104.93px]" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#ca3500] text-[12px]">🔥 1-day streak</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ffd6a8] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-[0.5px] tracking-[-0.4395px]">{`Haven't logged today's commute yet`}</p>
      <Text49 />
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Quick log or view all transport modes</p>
    </div>
  );
}

function Container126() {
  return (
    <div className="flex-[1_0_0] h-[51px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading7 />
        <Paragraph30 />
      </div>
    </div>
  );
}

function Container124() {
  return (
    <div className="h-[51px] relative shrink-0 w-[492.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container125 />
        <Container126 />
      </div>
    </div>
  );
}

function Icon38() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon38 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[77.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">All Modes</p>
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p93fc9f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36e9fb40} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#096] h-[36px] relative rounded-[8px] shrink-0 w-[122.047px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon39 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[77px] not-italic text-[14px] text-center text-white top-[8.5px] tracking-[-0.1504px]">Quick Log</p>
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="h-[36px] relative shrink-0 w-[256.938px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container124 />
        <Container127 />
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[103px] relative rounded-[14px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(175.392deg, rgb(236, 253, 245) 0%, rgb(255, 255, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border-2 border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start p-[26px] relative size-full">
        <Container123 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] h-[1587.5px] items-center left-[123px] top-[47px] w-[1278px]" data-name="Main Content">
      <Container1 />
      <Container5 />
      <Container18 />
      <Frame />
      <Container122 />
    </div>
  );
}

function Section() {
  return <div className="absolute h-0 left-0 top-[1279px] w-[1461px]" data-name="Section" />;
}

function Container() {
  return (
    <div className="h-[1722px] relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(170.625deg, rgb(239, 255, 248) 0.15476%, rgb(246, 246, 246) 28.297%)" }}>
      <MainContent />
      <Section />
    </div>
  );
}

function Section1() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

function PK() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[1722px] items-start left-0 top-[64px] w-[1461px]" data-name="pK">
      <Container />
      <Section1 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M2.66667 8H13.3333" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 4H13.3333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 12H13.3333" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon40 />
      </div>
    </div>
  );
}

function Container128() {
  return (
    <div className="content-stretch flex h-[56px] items-center justify-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Button8 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1fc96a00} id="Vector" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33089d00} id="Vector_2" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p49cfa80} id="Vector_3" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1cfbf300} id="Vector_4" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute bg-[#eff6ff] content-stretch flex h-[40px] items-center justify-center left-[8px] rounded-[10px] top-[16px] w-[47px]" data-name="Link">
      <Icon41 />
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon42 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p382997c0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ad65a80} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 14.1667H12.5" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3849af00} id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon43 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p382997c0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2ad65a80} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 14.1667H12.5" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3849af00} id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon44 />
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_23_784)" id="Icon">
          <path d={svgPaths.p363df2c0} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_23_784">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon45 />
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon46 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[216px] items-start left-0 px-[8px] top-[80px] w-[63px]" data-name="Navigation">
      <Link2 />
      <Link3 />
      <Link4 />
      <Link5 />
      <Link6 />
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p145ec80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p548e880} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon47 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p164f7540} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative rounded-[10px] shrink-0 w-full" data-name="Link">
      <Icon48 />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[84px] items-start left-0 px-[8px] top-[320px] w-[63px]" data-name="Navigation">
      <Link7 />
      <Link8 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.ped54800} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link9() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-center justify-center left-[8px] rounded-[10px] top-[428px] w-[47px]" data-name="Link">
      <Icon49 />
    </div>
  );
}

function Container129() {
  return (
    <div className="h-[508px] relative shrink-0 w-full" data-name="Container">
      <Link1 />
      <Navigation />
      <Navigation1 />
      <Link9 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white h-[1279px] left-0 top-[64px] w-[64px]" data-name="Sidebar">
      <div className="content-stretch flex flex-col items-start overflow-clip pr-px relative rounded-[inherit] size-full">
        <Container128 />
        <Container129 />
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Text50() {
  return (
    <div className="h-[20px] relative shrink-0 w-[8.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px]">E</p>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 201, 80) 0%, rgb(0, 153, 102) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text50 />
      </div>
    </div>
  );
}

function Container134() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px] tracking-[-0.1504px]">Enwayu</p>
    </div>
  );
}

function Container133() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Container134 />
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container132 />
        <Container133 />
      </div>
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center left-[24px] top-[13.5px] w-[167.375px]" data-name="Container">
      <Link10 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[36px] left-0 rounded-[8px] top-0 w-[448px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">Search employees, risks, initiatives, reports...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon50() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute h-[36px] left-[398.41px] top-[13.5px] w-[448px]" data-name="Container">
      <TextInput />
      <Icon50 />
    </div>
  );
}

function Icon51() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[32px] left-[48px] rounded-[8px] top-[2px] w-[87.344px]" data-name="Button">
      <Icon51 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[56px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6.5px] tracking-[-0.1504px]">Export</p>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_23_658)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11f26280} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_23_658">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[147.34px] rounded-[8px] size-[36px] top-0" data-name="Button">
      <Icon52 />
    </div>
  );
}

function Container138() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-[0.5px] tracking-[-0.1504px]">John Employee</p>
    </div>
  );
}

function Container139() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Employee</p>
    </div>
  );
}

function Container137() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[52px] top-0 w-[100.219px]" data-name="Container">
      <Container138 />
      <Container139 />
    </div>
  );
}

function Icon53() {
  return (
    <div className="absolute left-[160.22px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text51() {
  return (
    <div className="bg-[#155dfc] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px]">JE</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-[12px] overflow-clip rounded-[16777200px] size-[32px] top-[2px]" data-name="Primitive.span">
      <Text51 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[36px] left-[195.34px] rounded-[8px] top-0 w-[188.219px]" data-name="Button">
      <Container137 />
      <Icon53 />
      <PrimitiveSpan />
    </div>
  );
}

function Icon54() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute bg-[#d4183d] left-[20px] rounded-[8px] size-[20px] top-[-4px]" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white">2</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute left-0 rounded-[8px] size-[36px] top-0" data-name="Button">
      <Icon54 />
      <Text52 />
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute h-[36px] left-[1053.44px] top-[13.5px] w-[383.563px]" data-name="Container">
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container130() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="Container">
      <Container131 />
      <Container135 />
      <Container136 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[64px] items-start left-0 pb-px top-0 w-[1461px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container130 />
    </div>
  );
}

export default function EnterpriseCommutingIntelligencePlatform() {
  return (
    <div className="bg-white relative size-full" data-name="Enterprise Commuting Intelligence Platform">
      <PK />
      <Sidebar />
      <Header />
    </div>
  );
}