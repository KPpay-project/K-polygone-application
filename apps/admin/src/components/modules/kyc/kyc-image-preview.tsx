const KycImagePreview = ({ imageUrl, label }: { imageUrl: string; label: string }) => {
  return (
    <div
      className="w-full lg:w-[450px] h-[220px] rounded-3xl flex  justify-center items-end  mt-6"
      style={{
        backgroundImage: `url(${imageUrl || 'https://avatars.githubusercontent.com/u/54102389?v=4'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className="rounded-3xl bg-white w-full  flex items-center justify-between px-4 w-[85%] py-3 mb-4
       h-[50px]  shadow-lg"
      >
        <span className="text-black font-medium">{label}</span>

        <span className="text-black text-sm border border-black rounded-full px-4 py-1 cursor-pointer">Preview</span>
      </div>
    </div>
  );
};

export default KycImagePreview;
