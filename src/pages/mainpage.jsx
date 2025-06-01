import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volleyball, BookOpen, Heart, Church, Languages, Microscope, User, Palette, Search, SearchIcon } from 'lucide-react';

const categories = [
  { name: '예술분과', color: 'bg-pink-100', text: 'text-pink-800', icon: <Palette size={16} />, items: ['천마응원단','육현','영화공간','신명만당','Luminous','THEWE','HOSA','에코스','(C)ARTOON','천마극단','예사가락','영남대 합창단', '사우회','Y.E.P','MAX&ZENITH','HIPCOM','코스모스','BLUEWAVE'] },
  { name: '체육분과', color: 'bg-red-100', text: 'text-red-800', icon: <Volleyball size={16} />, items: ['E.V.E', 'S.F.A','HI-CLEAR','YUTA','다이나마이트','산악회','영남대 농구반','탁우회','페가수스','YUBC','검도부','문무반','아카데믹스','유도사랑','탐험대','한마음'] },
  { name: '봉사분과', color: 'bg-orange-100', text: 'text-orange-800', icon: <Heart size={16} />, items: ['G.F.C', '그루터기','아베스타','영지회','천마라이프라인','해오름','K.U.S.A','스카우트','아트리','이끌림','한울회','영바시'] },
  { name: '종교분과', color: 'bg-green-100', text: 'text-green-800', icon: <Church size={16} />, items: ['아뉴스', 'S.F.C','I.V.F'] },
  { name: '어학분과', color: 'bg-purple-200', text: 'text-purple-800', icon: <Languages size={16} />, items: ['KABS', 'TIME','인스페니쉬','KO-JACOS'] },
  { name: '응용학술분과', color: 'bg-indigo-100', text: 'text-indigo-800', icon: <Microscope size={16} />, items: ['그리니치', '대맥학회','사고뭉치','천마DM'] },
  { name: '학술분과', color: 'bg-blue-100', text: 'text-blue-800', icon: <BookOpen size={16} />, items: ['4-H', 'SELV','R2','청탑','필드워크'] },
  { name: '교양분과', color: 'bg-yellow-200', text: 'text-yellow-800', icon: <User size={16} />, items: ['스타일러스', '기우회','애견클럽','자놀자','자유의지'] },
];

const MainPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="px-4 pt-20 z-10 relative max-w-[1400px] mx-auto">
      <div className="absolute inset-x-0 top-5 h-[400px] z-10 px-5">
        <img src="/campus.jpg" alt="영남대학교 정문" className="w-full h-full object-cover brightness-50 rounded-xl" />
      </div>

      <div className="absolute top-10 left-10 z-10 flex items-center space-x-3">
        <img src="/logo.png" alt="영남대" className="w-16 h-16" />
        <div className="text-[18px] font-bold text-white drop-shadow-md">
          영남대학교<br />
          <span className="text-[14px]">Yeungnam University</span>
        </div>
      </div>

      <div className="absolute top-10 right-10 z-10 flex items-center space-x-3">
        <img src="/danbi.png" alt="영남대" className="w-16 h-16" />
        <div className="text-[18px] font-bold text-white drop-shadow-md">
          총동아리협회<br />
          <span className="text-[14px]">Yeungnam University Club</span>
        </div>
      </div>

      <div className="flex justify-center items-center h-[300px] z-10 relative">
        <div className="text-center text-white">
          <h1 className="text-[100px] font-extrabold"><span className="text-blue-300">Y</span>uClub</h1>
          <p className="text-[18px] font-extrabold mt-1">함께 만들어가는 영남인의 동아리 공간</p>
        </div>
      </div>

      <div className="z-10 relative px-10 pb-4 -mt-10">
        <div className="max-w-xl mx-auto relative">
           {/*돋보기 아이콘 */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-black-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="동아리명을 검색하세요"
            className="w-full px-10 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="px-4 pt-10 z-10 relative max-w-[2000px] mx-auto">
        <div className="grid grid-cols-4 gap-x-8 gap-y-16">
          {filteredCategories.map((cat, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className={`flex items-center justify-between px-5 py-3 min-w-[140px] max-w-full rounded-full shadow-md w-full ${cat.color} ${cat.text} font-semibold overflow-hidden`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="truncate">{cat.name}</span>
                  <span className="flex-shrink-0">{cat.icon}</span>
                </div>
                <span className="ml-2 flex-shrink-0">
                  {openIndex === idx ? '▲' : '▼'}
                </span>
              </button>
              {openIndex === idx && (
                <ul className={`absolute z-10 mt-2 w-full border rounded shadow-md max-h-64 overflow-y-auto ${cat.color} ${cat.text}`}>
                  {cat.items.map((item, i) => (
                    <li key={i} className="px-4 py-2 hover:bg-white cursor-pointer"
                    onClick={() => {
                      const role = localStorage.getItem('userRole');
                      const encodedClub = encodeURIComponent(item);
                      if (role === 'ADMIN') {
                        navigate(`/adminpage/${encodedClub}`);
                      } else {
                        navigate(`/memberpage/${encodedClub}`);
                      }
                    }}
                  >
                    {item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;








