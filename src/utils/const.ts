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
  VenetianMask,
  type LucideProps
} from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

export interface TaroCard {
  id: number;
  name: string;
  image: FunctionalComponent<LucideProps>;
  // 正位含义
  positive?: string;
  // 逆位含义
  negative?: string;
}

export const taroCards: TaroCard[] = [
  {
    id: 1,
    name: '愚者',
    image: VenetianMask,
    positive: '新的开始、自由、冒险精神',
    negative: '鲁莽、缺乏方向、不负责任'
  },
  {
    id: 2,
    name: '魔术师',
    image: Wand,
    positive: '创造力、行动力、潜能',
    negative: '操控、欺骗、缺乏计划'
  },
  {
    id: 3,
    name: '女祭司',
    image: BookOpen,
    positive: '直觉、智慧、神秘',
    negative: '秘密、疏离、被动'
  },
  {
    id: 4,
    name: '皇后',
    image: Crown,
    positive: '丰饶、创造力、母性',
    negative: '依赖、过度保护、情感压抑'
  },
  {
    id: 5,
    name: '国王',
    image: Crown,
    positive: '权威、稳定、领导力',
    negative: '专制、固执、冷漠'
  },
  {
    id: 6,
    name: '恋人',
    image: Heart,
    positive: '爱、和谐、选择',
    negative: '冲突、不和、优柔寡断'
  },
  {
    id: 7,
    name: '战车',
    image: Truck,
    positive: '意志力、胜利、控制',
    negative: '失控、失败、冲突'
  },
  {
    id: 8,
    name: '力量',
    image: BicepsFlexed,
    positive: '勇气、耐心、内在力量',
    negative: '恐惧、怀疑、自我怀疑'
  },
  {
    id: 9,
    name: '隐士',
    image: EyeOff,
    positive: '内省、智慧、指导',
    negative: '孤立、退缩、迷失方向'
  },
  {
    id: 10,
    name: '命运之轮',
    image: Circle,
    positive: '变化、好运、命运',
    negative: '不稳定、厄运、失控'
  },
  {
    id: 11,
    name: '正义',
    image: Shield,
    positive: '公平、真相、责任',
    negative: '不公正、偏见、逃避责任'
  },
  {
    id: 12,
    name: '倒吊人',
    image: Drama,
    positive: '牺牲、新视角、接受',
    negative: '拖延、僵局、抗拒改变'
  },
  {
    id: 13,
    name: '死神',
    image: Ghost,
    positive: '转变、结束、新的开始',
    negative: '抗拒改变、停滞、恐惧'
  },
  {
    id: 14,
    name: '恶魔',
    image: Skull,
    positive: '诱惑、物质享受、欲望',
    negative: '束缚、成瘾、负面模式'
  },
  {
    id: 15,
    name: '塔',
    image: TowerControl,
    positive: '突然的改变、启示、清理',
    negative: '混乱、灾难、意外'
  }
];
