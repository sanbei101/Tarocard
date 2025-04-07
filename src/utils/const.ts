import {
    BookOpen,
    Crown,
    Heart,
    Truck,
    BicepsFlexed,
    EyeOff,
    Wand,
    Circle,
    Drama,
    Ghost,
    Skull,
    Shield,
    TowerControl,
    VenetianMask
} from 'lucide-vue-next';
import type { TaroCard } from '@/components/Card.vue';

export const taroCards: TaroCard[] = ([
    { id: 1, name: '愚者', image: VenetianMask },
    { id: 2, name: '魔术师', image: Wand },
    { id: 3, name: '女祭司', image: BookOpen },
    { id: 4, name: '皇后', image: Crown },
    { id: 5, name: '国王', image: Crown },
    { id: 6, name: '恋人', image: Heart },
    { id: 7, name: '战车', image: Truck },
    { id: 8, name: '力量', image: BicepsFlexed },
    { id: 9, name: '隐士', image: EyeOff },
    { id: 10, name: '命运之轮', image: Circle },
    { id: 11, name: '正义', image: Shield },
    { id: 12, name: '倒吊人', image: Drama },
    { id: 13, name: '死神', image: Ghost },
    { id: 14, name: '恶魔', image: Skull },
    { id: 15, name: '塔', image: TowerControl }
]);