import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/app/components/shared/Navbar';
import { getProfessionals } from '@/app/lib/mockData';
import { Professional } from '@/app/lib/types';
import { Search, Star, Calendar, Filter } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export const ProfessionalList: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPros, setFilteredPros] = useState<Professional[]>([]);

  useEffect(() => {
    const pros = getProfessionals();
    setProfessionals(pros);
    setFilteredPros(pros);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = professionals.filter(
        pro =>
          pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pro.profession.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPros(filtered);
    } else {
      setFilteredPros(professionals);
    }
  }, [searchTerm, professionals]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Professional</h1>
          <p className="text-gray-400">Browse and book appointments with top professionals</p>
        </motion.div>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/professionals/${pro.id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="glass rounded-xl overflow-hidden glow-hover-cyan transition-all"
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{pro.name}</h3>
                      <p className="text-cyan-400 text-sm">{pro.profession}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-gray-400 text-sm line-clamp-2">{pro.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="size-4 fill-current" />
                        <span className="font-semibold">{pro.rating}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {pro.experience} years exp.
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all">
                        <Calendar className="size-4" />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
