
import { BlogPost, Project, HobbyItem, MindMapNode } from './types';

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: '关于《日记》的创作碎碎念',
    excerpt: '在这个快节奏的时代，我希望能做出一款能让人安静下来的叙事游戏。',
    content: '全文内容加载中...',
    date: '2024年05月20日',
    tags: ['游戏开发', '叙事', '日记']
  },
  {
    id: '2',
    title: '从像素画中寻找冬日的宁静',
    excerpt: '那张红发少女在雪地小巷中的图给了我极大的震撼。',
    content: '艺术风格探讨...',
    date: '2024年05月18日',
    tags: ['艺术感悟', '审美']
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: '日记 (Diary)',
    description: '一款关于失去、回忆与自我救赎的大气氛围解谜游戏。',
    category: 'game',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000'
  },
  {
    id: 'p2',
    name: '神经感知与虚拟环境研究',
    description: '探讨人类在虚拟空间中的视觉处理模式及其对心理的影响。',
    category: 'research',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000'
  }
];

export const INITIAL_HOBBIES: HobbyItem[] = [
  { id: 'h1', type: 'book', title: '沉默的巡游', creator: '东野圭吾', comment: '逻辑缜密，人性刻画入木三分。', rating: 5 },
  { id: 'h2', type: 'movie', title: '星际穿越', creator: '克里斯托弗·诺兰', comment: '爱是唯一跨越时空的维度。', rating: 5 },
  { id: 'h3', type: 'music', title: '夜晚的序曲', creator: '久石让', comment: '适合在写代码时静静倾听。', rating: 5 }
];

export const INITIAL_MINDMAP: MindMapNode = {
  id: 'root',
  label: '我的宇宙',
  children: [
    {
      id: 'projects',
      label: '项目工程',
      children: [
        { id: 'p-games', label: '独立游戏《日记》' },
        { id: 'p-sci', label: '科研课题' },
        { id: 'p-open', label: '开源贡献' }
      ]
    },
    {
      id: 'hobbies',
      label: '精神角落',
      children: [
        { id: 'h-books', label: '书架' },
        { id: 'h-music', label: '黑胶收藏' },
        { id: 'h-films', label: '观影列表' }
      ]
    },
    {
        id: 'thoughts',
        label: '碎碎念',
        children: [
            { id: 't-tech', label: '技术总结' },
            { id: 't-life', label: '生活瞬间' }
        ]
    }
  ]
};
