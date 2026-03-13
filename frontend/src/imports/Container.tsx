import svgPaths from "./svg-7ygnstt3ja";

function Icon() {
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

function Container1() {
  return (
    <div className="bg-gradient-to-r from-[#096] h-[76px] relative rounded-[16777200px] shrink-0 to-[#00bc7d] w-[378px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[16px] relative size-full">
        <Icon />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] not-italic relative shrink-0 text-[27px] text-center text-white tracking-[-0.4395px]">Green Champion!</p>
      </div>
    </div>
  );
}

function Paragraph() {
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

export default function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start px-[25px] py-[37px] relative rounded-[14px] size-full" data-name="Container" style={{ backgroundImage: "linear-gradient(152.288deg, rgb(10, 10, 10) 0%, rgb(0, 153, 102) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#fff085] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container1 />
      <Paragraph />
    </div>
  );
}