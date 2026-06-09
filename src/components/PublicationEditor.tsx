import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  List, 
  ListOrdered, 
  Quote, 
  Sparkles, 
  FileText, 
  Download, 
  ChevronDown, 
  Eye, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  Minimize2,
  FileBadge,
  Percent,
  RefreshCw,
  GripVertical,
  Upload
} from 'lucide-react';
import { Company } from '../types';

export interface Block {
  id: string;
  type: 
    | 'heading_1' 
    | 'heading_2' 
    | 'heading_3' 
    | 'paragraph' 
    | 'bullet_list' 
    | 'numbered_list' 
    | 'image' 
    | 'table' 
    | 'formula' 
    | 'spoiler_quote' 
    | 'small_quote' 
    | 'large_quote' 
    | 'company_card' 
    | 'file_download';
  content: string;
  listItems?: string[];
  imageUrl?: string;
  imageCaption?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  formulaText?: string;
  spoilerLabel?: string;
  spoilerContent?: string;
  largeQuoteTitle?: string;
  largeQuoteText?: string;
  largeQuoteBullets?: string[];
  largeQuoteNumbers?: string[];
  largeQuoteBlocks?: Block[];
  companyId?: string;
  fileName?: string;
  fileSize?: string;
}

interface PublicationEditorProps {
  companies: Company[];
  userName: string;
  userLogin: string;
  avatarUrl: string;
  onBack: () => void;
  onSaveSuccess: () => void;
  editingArticle?: any | null;
}

const PRESET_COVERS = [
  { id: 'gradient-1', name: 'Синий индиго', css: 'from-blue-600 via-indigo-600 to-violet-700' },
  { id: 'gradient-2', name: 'Бирюзовое сияние', css: 'from-emerald-500 via-teal-600 to-cyan-700' },
  { id: 'gradient-3', name: 'Закат', css: 'from-amber-500 via-orange-600 to-red-700' },
  { id: 'gradient-4', name: 'Темный уголь', css: 'from-slate-700 via-slate-850 to-slate-905' },
];

const BLOCK_TYPES_CONFIG = [
  { type: 'paragraph', name: 'Обычно текст', icon: AlignLeft },
  { type: 'heading_1', name: 'Заголовок H1', icon: Heading1 },
  { type: 'heading_2', name: 'Заголовок H2', icon: Heading2 },
  { type: 'heading_3', name: 'Заголовок H3', icon: Heading3 },
  { type: 'bullet_list', name: 'Маркер. список', icon: List },
  { type: 'numbered_list', name: 'Номер. список', icon: ListOrdered },
  { type: 'image', name: 'Иллюстрация', icon: ImageIcon },
  { type: 'table', name: 'Таблица', icon: TableIcon },
  { type: 'formula', name: 'Формула', icon: Percent },
  { type: 'spoiler_quote', name: 'Спойлер', icon: Eye },
  { type: 'small_quote', name: 'Курсив цитата', icon: Quote },
  { type: 'large_quote', name: 'Эксперт блок', icon: Sparkles },
  { type: 'company_card', name: 'Связь компании', icon: ExternalLink },
  { type: 'file_download', name: 'Файл вложение', icon: Download },
] as const;

export default function PublicationEditor({
  companies,
  userName,
  userLogin,
  avatarUrl,
  onBack,
  onSaveSuccess,
  editingArticle = null
}: PublicationEditorProps) {
  const [pubId] = useState(() => editingArticle?.id || `custom-pub-draft-${Date.now()}`);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'company_news' | 'market_analytics' | 'taxes_and_regulations' | 'cases_interviews' | 'guides_tutorials'>('market_analytics');
  
  // Cover selection
  const [coverType, setCoverType] = useState<'preset' | 'custom'>('preset');
  const [selectedCover, setSelectedCover] = useState('from-blue-600 via-indigo-600 to-violet-700');
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [coverX, setCoverX] = useState(() => editingArticle?.coverX ?? 50);
  const [coverY, setCoverY] = useState(() => editingArticle?.coverY ?? 50);

  // Blocks state
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 'block-init-1',
      type: 'paragraph',
      content: 'Это текст вашей публикации. Вы можете редактировать его или собирать статью как конструктор в Notion, добавляя разнообразные блоки ниже.'
    }
  ]);

  // Dropdown block type selector state
  const [activeTypeDropdownBlockId, setActiveTypeDropdownBlockId] = useState<string | null>(null);

  // Load article if in editing mode
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setCategory(editingArticle.category || 'market_analytics');
      if (editingArticle.coverType) {
        setCoverType(editingArticle.coverType);
      } else if (editingArticle.imageGradient) {
        setCoverType('preset');
        setSelectedCover(editingArticle.imageGradient);
      }
      if (editingArticle.selectedCover) {
        setSelectedCover(editingArticle.selectedCover);
      }
      if (editingArticle.customCoverUrl) {
        setCustomCoverUrl(editingArticle.customCoverUrl);
      }
      if (editingArticle.coverX !== undefined) {
        setCoverX(editingArticle.coverX);
      } else {
        setCoverX(50);
      }
      if (editingArticle.coverY !== undefined) {
        setCoverY(editingArticle.coverY);
      } else {
        setCoverY(50);
      }
      const normalizedBlocks = (editingArticle.blocks || []).map((b: any) => {
        if (b.type === 'large_quote' && !b.largeQuoteBlocks) {
          const subb: Block[] = [];
          if (b.largeQuoteTitle) {
            subb.push({
              id: `sub-mig-title-${b.id}`,
              type: 'heading_3',
              content: b.largeQuoteTitle
            });
          }
          if (b.largeQuoteText) {
            subb.push({
              id: `sub-mig-text-${b.id}`,
              type: 'paragraph',
              content: b.largeQuoteText
            });
          }
          if (b.largeQuoteBullets && b.largeQuoteBullets.length > 0) {
            subb.push({
              id: `sub-mig-bullets-${b.id}`,
              type: 'bullet_list',
              content: '',
              listItems: b.largeQuoteBullets
            });
          }
          if (b.largeQuoteNumbers && b.largeQuoteNumbers.length > 0) {
            subb.push({
              id: `sub-mig-numbers-${b.id}`,
              type: 'numbered_list',
              content: '',
              listItems: b.largeQuoteNumbers
            });
          }
          return {
            ...b,
            largeQuoteBlocks: subb
          };
        }
        return b;
      });
      setBlocks(normalizedBlocks);
    }
  }, [editingArticle]);

  // Auto-save/sync draft in localStorage
  useEffect(() => {
    const wordCount = blocks.reduce((acc, b) => {
      if (b.type === 'large_quote' && b.largeQuoteBlocks) {
        return acc + b.largeQuoteBlocks.reduce((subAcc, sb) => subAcc + (sb.content?.split(/\s+/).length || 0), 0);
      }
      return acc + (b.content?.split(/\s+/).length || 0);
    }, 0);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 120));

    const draftItem = {
      id: pubId,
      title: title.trim() || 'Черновик (без названия)',
      date: editingArticle?.date || (new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + ' г.'),
      category,
      imageGradient: coverType === 'preset' ? selectedCover : 'from-indigo-600 via-indigo-700 to-indigo-850',
      imagePatternId: editingArticle?.imagePatternId || Math.floor(Math.random() * 5) + 1,
      author: editingArticle?.author || {
        firstName: userName.split(' ')[0] || userLogin,
        lastName: userName.split(' ')[1] || '',
        avatarUrl: avatarUrl || 'bg-gradient-to-tr from-sky-450 to-blue-600',
        role: 'Уполномоченный автор'
      },
      readTime: `${calculatedMinutes} мин`,
      summary: blocks.find(b => b.type === 'paragraph' && b.content && b.content.trim())?.content?.slice(0, 140) + '...' || 'Черновик публикации',
      likes: editingArticle?.likes || 1,
      blocks: blocks,
      status: 'draft',
      coverType,
      selectedCover,
      customCoverUrl,
      coverX,
      coverY
    };

    const saved = localStorage.getItem('custom_publications');
    const list = saved ? JSON.parse(saved) : [];

    const idx = list.findIndex((x: any) => x.id === pubId);
    if (idx !== -1) {
      const existingStatus = list[idx].status;
      list[idx] = {
        ...list[idx],
        ...draftItem,
        status: existingStatus === 'pending' || existingStatus === 'published' ? existingStatus : 'draft'
      };
    } else {
      list.unshift(draftItem);
    }

    localStorage.setItem('custom_publications', JSON.stringify(list));
  }, [pubId, title, category, coverType, selectedCover, customCoverUrl, blocks, userName, userLogin, avatarUrl, editingArticle, coverX, coverY]);

  const [insertingAtIndex, setInsertingAtIndex] = useState<number | null>(null);


  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Drag and Drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingTool, setIsDraggingTool] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleToolDragStart = (e: React.DragEvent, type: Block['type']) => {
    e.dataTransfer.setData('text/new-block-type', type);
    e.dataTransfer.effectAllowed = 'copy';
    setIsDraggingTool(true);
  };

  const handleToolDragEnd = () => {
    setIsDraggingTool(false);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null && !isDraggingTool) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingTool(false);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const newBlockType = e.dataTransfer.getData('text/new-block-type');

    if (newBlockType) {
      insertBlockAtIndex(newBlockType as Block['type'], targetIndex);
    } else if (draggedIndex !== null) {
      if (draggedIndex === targetIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }
      const updated = [...blocks];
      const [draggedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);
      setBlocks(updated);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingTool(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Пожалуйста, выберите файл в формате JPEG или PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateBlockProp(blockId, 'imageUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageFileDrop = (e: React.DragEvent<HTMLDivElement>, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Пожалуйста, выберите файл в формате JPEG или PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateBlockProp(blockId, 'imageUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Пожалуйста, выберите файл в формате JPEG или PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomCoverUrl(event.target.result as string);
          setCoverType('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Пожалуйста, выберите файл в формате JPEG или PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomCoverUrl(event.target.result as string);
          setCoverType('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop states for nested blocks inside large quote blocks
  const [draggedSub, setDraggedSub] = useState<{ parentId: string; idx: number } | null>(null);
  const [dragOverSub, setDragOverSub] = useState<{ parentId: string; idx: number } | null>(null);

  const handleSubDragStart = (e: React.DragEvent, parentId: string, idx: number) => {
    e.stopPropagation(); // crucial to prevent the parent block from dragging instead!
    setDraggedSub({ parentId, idx });
    e.dataTransfer.setData('text/sub-index', idx.toString());
    e.dataTransfer.setData('text/parent-id', parentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubDragOver = (e: React.DragEvent, parentId: string, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedSub) return;
    if (draggedSub.parentId !== parentId) return; // only allow dragging inside the same quote box!
    if (!dragOverSub || dragOverSub.idx !== idx) {
      setDragOverSub({ parentId, idx });
    }
  };

  const handleSubDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedSub(null);
    setDragOverSub(null);
  };

  const handleSubDrop = (e: React.DragEvent, parentId: string, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedSub || draggedSub.parentId !== parentId || draggedSub.idx === targetIdx) {
      setDraggedSub(null);
      setDragOverSub(null);
      return;
    }

    setBlocks(blocks.map(b => {
      if (b.id === parentId && b.largeQuoteBlocks) {
        const updated = [...b.largeQuoteBlocks];
        const [removed] = updated.splice(draggedSub.idx, 1);
        updated.splice(targetIdx, 0, removed);
        return {
          ...b,
          largeQuoteBlocks: updated
        };
      }
      return b;
    }));

    setDraggedSub(null);
    setDragOverSub(null);
  };

  const updateNestedBlockContent = (blockId: string, subBlockId: string, text: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.largeQuoteBlocks) {
        return {
          ...b,
          largeQuoteBlocks: b.largeQuoteBlocks.map(sb => 
            sb.id === subBlockId ? { ...sb, content: text } : sb
          )
        };
      }
      return b;
    }));
  };

  const updateNestedBlockListItem = (blockId: string, subBlockId: string, listIndex: number, text: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.largeQuoteBlocks) {
        return {
          ...b,
          largeQuoteBlocks: b.largeQuoteBlocks.map(sb => {
            if (sb.id === subBlockId && sb.listItems) {
              const newList = [...sb.listItems];
              newList[listIndex] = text;
              return { ...sb, listItems: newList };
            }
            return sb;
          })
        };
      }
      return b;
    }));
  };

  const addNestedBlockListItem = (blockId: string, subBlockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.largeQuoteBlocks) {
        return {
          ...b,
          largeQuoteBlocks: b.largeQuoteBlocks.map(sb => {
            if (sb.id === subBlockId) {
              const newList = [...(sb.listItems || []), 'Новая строка списка'];
              return { ...sb, listItems: newList };
            }
            return sb;
          })
        };
      }
      return b;
    }));
  };

  const removeNestedBlockListItem = (blockId: string, subBlockId: string, listIndex: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.largeQuoteBlocks) {
        return {
          ...b,
          largeQuoteBlocks: b.largeQuoteBlocks.map(sb => {
            if (sb.id === subBlockId && sb.listItems) {
              return { ...sb, listItems: sb.listItems.filter((_, i) => i !== listIndex) };
            }
            return sb;
          })
        };
      }
      return b;
    }));
  };

  const addNestedBlock = (blockId: string, type: 'paragraph' | 'heading_3' | 'small_quote' | 'bullet_list' | 'numbered_list') => {
    const subId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let newSub: Block = {
      id: subId,
      type,
      content: ''
    };
    if (type === 'heading_3') {
      newSub.content = 'Мелкий заголовок H3';
    } else if (type === 'paragraph') {
      newSub.content = 'Абзац текста в цитате...';
    } else if (type === 'small_quote') {
      newSub.content = '«Короткая цитата...»';
    } else if (type === 'bullet_list') {
      newSub.listItems = ['Пункт 1', 'Пункт 2'];
    } else if (type === 'numbered_list') {
      newSub.listItems = ['Пункт 1', 'Пункт 2'];
    }

    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          largeQuoteBlocks: [...(b.largeQuoteBlocks || []), newSub]
        };
      }
      return b;
    }));
  };

  const deleteNestedBlock = (blockId: string, subBlockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.largeQuoteBlocks) {
        return {
          ...b,
          largeQuoteBlocks: b.largeQuoteBlocks.filter(sb => sb.id !== subBlockId)
        };
      }
      return b;
    }));
  };

  // Auto-generate some dummy company files/options
  const companyOptions = companies && companies.length ? companies : [];

  // Block Creators
  const insertBlockAtIndex = (type: Block['type'], index: number) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let newBlock: Block = {
      id: newId,
      type,
      content: ''
    };

    // Initialize block-specific properties
    switch (type) {
      case 'heading_1':
        newBlock.content = 'Главный заголовок H1';
        break;
      case 'heading_2':
        newBlock.content = 'Подраздел H2';
        break;
      case 'heading_3':
        newBlock.content = 'Мелкий заголовок H3';
        break;
      case 'paragraph':
        newBlock.content = 'Введите обычный текст абзаца...';
        break;
      case 'bullet_list':
        newBlock.listItems = ['Первый пункт маркированного списка', 'Второй пункт списка'];
        break;
      case 'numbered_list':
        newBlock.listItems = ['Первый нумерованный пункт', 'Второй нумерованный пункт'];
        break;
      case 'image':
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800';
        newBlock.imageCaption = 'Динамика финансового аудита компании';
        break;
      case 'table':
        newBlock.tableData = {
          headers: ['Показатель', 'Период t-1', 'Период t'],
          rows: [
            ['Выручка', '125 000 руб', '140 000 руб'],
            ['EBITDA', '32 000 руб', '38 000 руб'],
            ['Чистая прибыль', '12 500 руб', '18 2000 руб']
          ]
        };
        break;
      case 'formula':
        newBlock.formulaText = 'PV = \\sum_{t=1}^{n} \\frac{PMT_t}{(1 + r)^t}';
        newBlock.content = 'PV = ∑ [ PMT_t / (1 + r)^t ]';
        break;
      case 'spoiler_quote':
        newBlock.spoilerLabel = 'Исключения ФСБУ 25/2018 «Аренда»';
        newBlock.spoilerContent = 'Стандарт разрешает не отражать обязательства по аренде, если срок договора составляет до 12 месяцев, либо объект закупки стоит менее 300 000 ₽.';
        break;
      case 'small_quote':
        newBlock.content = '«Рационализация расчета ППА обеспечивает существенную экономию на налогах на имущество холдинговой структуры.»';
        break;
      case 'large_quote':
        newBlock.largeQuoteTitle = 'Рекомендации Финансового Методолога';
        newBlock.largeQuoteBlocks = [
          {
            id: `sub-${Date.now()}-1`,
            type: 'heading_3',
            content: 'Рекомендации Финансового Методолога'
          },
          {
            id: `sub-${Date.now()}-2`,
            type: 'paragraph',
            content: 'При оценке права пользования активом рекомендуем обращать внимание на следующие параметры:'
          },
          {
            id: `sub-${Date.now()}-3`,
            type: 'bullet_list',
            content: '',
            listItems: ['Эффективная ставка заимствования', 'Реальные намерения по пролонгации']
          },
          {
            id: `sub-${Date.now()}-4`,
            type: 'numbered_list',
            content: '',
            listItems: ['Выделить номинальные платежи', 'Рассчитать коэффициенты дисконтирования']
          }
        ];
        break;
      case 'company_card':
        newBlock.companyId = companyOptions[0]?.id || '1027700067328';
        break;
      case 'file_download':
        newBlock.fileName = 'Шаблон_калькулятора_ППА_ФСБУ25.xlsx';
        newBlock.fileSize = '145 КБ';
        break;
    }

    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    setBlocks(updated);
    setInsertingAtIndex(null);
  };

  const addBlock = (type: Block['type']) => {
    insertBlockAtIndex(type, blocks.length);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const changeBlockType = (id: string, newType: Block['type']) => {
    setBlocks(prev => prev.map(block => {
      if (block.id !== id) return block;
      
      let updatedBlock: Block = {
        ...block,
        type: newType,
      };

      // Clean up standard/nested elements to avoid conflicting schema issues
      if (newType !== 'bullet_list' && newType !== 'numbered_list') {
        delete updatedBlock.listItems;
      }
      if (newType !== 'image') {
        delete updatedBlock.imageUrl;
        delete updatedBlock.imageCaption;
      }
      if (newType !== 'table') {
        delete updatedBlock.tableData;
      }
      if (newType !== 'formula') {
        delete updatedBlock.formulaText;
      }
      if (newType !== 'spoiler_quote') {
        delete updatedBlock.spoilerLabel;
        delete updatedBlock.spoilerContent;
      }
      if (newType !== 'large_quote') {
        delete updatedBlock.largeQuoteTitle;
        delete updatedBlock.largeQuoteText;
        delete updatedBlock.largeQuoteBullets;
        delete updatedBlock.largeQuoteNumbers;
        delete updatedBlock.largeQuoteBlocks;
      }
      if (newType !== 'company_card') {
        delete updatedBlock.companyId;
      }
      if (newType !== 'file_download') {
        delete updatedBlock.fileName;
        delete updatedBlock.fileSize;
      }

      // Ensure appropriate fields are initialized if they don't exist
      switch (newType) {
        case 'heading_1':
          if (!updatedBlock.content || updatedBlock.content.trim() === 'Это текст вашей публикации. Вы можете редактировать его или собирать статью как конструктор в Notion, добавляя разнообразные блоки ниже.') {
            updatedBlock.content = 'Главный заголовок H1';
          }
          break;
        case 'heading_2':
          if (!updatedBlock.content || updatedBlock.content.trim() === 'Это текст вашей публикации. Вы можете редактировать его или собирать статью как конструктор в Notion, добавляя разнообразные блоки ниже.') {
            updatedBlock.content = 'Подраздел H2';
          }
          break;
        case 'heading_3':
          if (!updatedBlock.content || updatedBlock.content.trim() === 'Это текст вашей публикации. Вы можете редактировать его или собирать статью как конструктор в Notion, добавляя разнообразные блоки ниже.') {
            updatedBlock.content = 'Мелкий заголовок H3';
          }
          break;
        case 'paragraph':
          if (!updatedBlock.content) {
            updatedBlock.content = 'Введите обычный текст абзаца...';
          }
          break;
        case 'bullet_list':
          if (!updatedBlock.listItems || updatedBlock.listItems.length === 0) {
            updatedBlock.listItems = updatedBlock.content ? [updatedBlock.content] : ['Первый пункт маркированного списка', 'Второй пункт списка'];
          }
          break;
        case 'numbered_list':
          if (!updatedBlock.listItems || updatedBlock.listItems.length === 0) {
            updatedBlock.listItems = updatedBlock.content ? [updatedBlock.content] : ['Первый нумерованный пункт', 'Второй нумерованный пункт'];
          }
          break;
        case 'image':
          if (!updatedBlock.imageUrl) {
            updatedBlock.imageUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800';
          }
          if (!updatedBlock.imageCaption) {
            updatedBlock.imageCaption = updatedBlock.content || 'Динамика финансового аудита компании';
          }
          break;
        case 'table':
          if (!updatedBlock.tableData) {
            updatedBlock.tableData = {
              headers: ['Показатель', 'Период t-1', 'Период t'],
              rows: [
                [updatedBlock.content || 'Выручка', '125 000 руб', '140 000 руб'],
                ['EBITDA', '32 000 руб', '38 000 руб'],
                ['Чистая прибыль', '12 500 руб', '18 2000 руб']
              ]
            };
          }
          break;
        case 'formula':
          if (!updatedBlock.formulaText) {
            updatedBlock.formulaText = 'PV = \\sum_{t=1}^{n} \\frac{PMT_t}{(1 + r)^t}';
          }
          if (!updatedBlock.content || updatedBlock.content.indexOf('=') === -1) {
            updatedBlock.content = 'PV = ∑ [ PMT_t / (1 + r)^t ]';
          }
          break;
        case 'spoiler_quote':
          if (!updatedBlock.spoilerLabel) {
            updatedBlock.spoilerLabel = 'Исключения ФСБУ 25/2018 «Аренда»';
          }
          if (!updatedBlock.spoilerContent) {
            if (updatedBlock.content) {
              updatedBlock.spoilerContent = updatedBlock.content;
            } else {
              updatedBlock.spoilerContent = 'Стандарт разрешает не отражать обязательства по аренде, если срок договора составляет до 12 месяцев, либо объект закупки стоит менее 300 000 ₽.';
            }
          }
          break;
        case 'small_quote':
          if (!updatedBlock.content) {
            updatedBlock.content = '«Рационализация расчета ППА обеспечивает существенную экономию на налогах на имущество холдинговой структуры.»';
          }
          break;
        case 'large_quote':
          if (!updatedBlock.largeQuoteTitle) {
            updatedBlock.largeQuoteTitle = 'Рекомендации Финансового Методолога';
          }
          if (!updatedBlock.largeQuoteBlocks) {
            updatedBlock.largeQuoteBlocks = [
              {
                id: `sub-${Date.now()}-1`,
                type: 'heading_3',
                content: updatedBlock.content || 'Рекомендации Финансового Методолога'
              },
              {
                id: `sub-${Date.now()}-2`,
                type: 'paragraph',
                content: 'При оценке права пользования активом рекомендуем обращать внимание на следующие параметры:'
              },
              {
                id: `sub-${Date.now()}-3`,
                type: 'bullet_list',
                content: '',
                listItems: ['Эффективная ставка заимствования', 'Реальные намерения по пролонгации']
              }
            ];
          }
          break;
        case 'company_card':
          if (!updatedBlock.companyId) {
            updatedBlock.companyId = companyOptions[0]?.id || '1027700067328';
          }
          break;
        case 'file_download':
          if (!updatedBlock.fileName) {
            updatedBlock.fileName = 'Шаблон_калькулятора_ППА_ФСБУ25.xlsx';
          }
          if (!updatedBlock.fileSize) {
            updatedBlock.fileSize = '145 КБ';
          }
          break;
      }
      return updatedBlock;
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  // Block field state modifiers
  const updateBlockContent = (id: string, text: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: text } : b));
  };

  const updateBlockProp = (id: string, key: string, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  // List element helper
  const updateListItem = (blockId: string, listIndex: number, text: string, isBullet: boolean) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const key = isBullet ? 'largeQuoteBullets' : (b.type === 'large_quote' ? 'largeQuoteNumbers' : 'listItems');
        const items = [...(b[key as keyof Block] as string[] || [])];
        items[listIndex] = text;
        return { ...b, [key]: items };
      }
      return b;
    }));
  };

  const addListItem = (blockId: string, isBullet: boolean) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const key = isBullet ? 'largeQuoteBullets' : (b.type === 'large_quote' ? 'largeQuoteNumbers' : 'listItems');
        const items = [...(b[key as keyof Block] as string[] || []), 'Новая строка списка'];
        return { ...b, [key]: items };
      }
      return b;
    }));
  };

  const removeListItem = (blockId: string, listIndex: number, isBullet: boolean) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        const key = isBullet ? 'largeQuoteBullets' : (b.type === 'large_quote' ? 'largeQuoteNumbers' : 'listItems');
        const items = [...(b[key as keyof Block] as string[] || [])].filter((_, i) => i !== listIndex);
        return { ...b, [key]: items };
      }
      return b;
    }));
  };

  // Table Helpers
  const updateTableCell = (blockId: string, rowIndex: number, colIndex: number, text: string, isHeader: boolean) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.tableData) {
        const table = { ...b.tableData };
        if (isHeader) {
          table.headers[colIndex] = text;
        } else {
          table.rows[rowIndex][colIndex] = text;
        }
        return { ...b, tableData: table };
      }
      return b;
    }));
  };

  const addTableRow = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.tableData) {
        const table = { ...b.tableData };
        const newRow = Array(table.headers.length).fill('Ячейка');
        table.rows.push(newRow);
        return { ...b, tableData: table };
      }
      return b;
    }));
  };

  const removeTableRow = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.tableData) {
        const table = { ...b.tableData };
        if (table.rows.length > 1) {
          table.rows.pop();
        }
        return { ...b, tableData: table };
      }
      return b;
    }));
  };

  const addTableCol = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.tableData) {
        const table = { ...b.tableData };
        table.headers.push('Колонка');
        table.rows = table.rows.map(row => [...row, 'Ячейка']);
        return { ...b, tableData: table };
      }
      return b;
    }));
  };

  const removeTableCol = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.tableData) {
        const table = { ...b.tableData };
        if (table.headers.length > 1) {
          table.headers.pop();
          table.rows = table.rows.map(row => row.slice(0, -1));
        }
        return { ...b, tableData: table };
      }
      return b;
    }));
  };

  // Submit and persistent write
  const handleSavePublication = () => {
    if (!title.trim()) {
      alert('Пожалуйста, введите название публикации.');
      return;
    }

    const isModeratorRole = localStorage.getItem('profile_userRole') === 'moderator';
    const defaultStatus = isModeratorRole ? 'published' : 'pending';

    const coverCss = coverType === 'preset' ? selectedCover : `url(${customCoverUrl})`;
    
    // Calculate read time based on text blocks
    const wordCount = blocks.reduce((acc, b) => acc + (b.content?.split(/\s+/).length || 0), 0);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 120));

    // Construct publication item
    const newArticles = {
      id: pubId,
      title: title.trim(),
      date: editingArticle?.date || (new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + ' г.'),
      category,
      imageGradient: coverType === 'preset' ? selectedCover : 'from-indigo-600 via-indigo-700 to-indigo-850',
      imagePatternId: editingArticle?.imagePatternId || Math.floor(Math.random() * 5) + 1,
      author: editingArticle?.author || {
        firstName: userName.split(' ')[0] || userLogin,
        lastName: userName.split(' ')[1] || '',
        avatarUrl: avatarUrl || 'bg-gradient-to-tr from-sky-450 to-blue-600',
        role: 'Уполномоченный автор'
      },
      readTime: `${calculatedMinutes} мин`,
      summary: blocks.find(b => b.type === 'paragraph' && b.content && b.content.trim())?.content?.slice(0, 140) + '...' || 'Пользовательская публикация',
      likes: editingArticle?.likes || 1,
      blocks: blocks,
      status: defaultStatus,
      coverType,
      selectedCover,
      customCoverUrl,
      coverX,
      coverY
    };

    // Save list to localStorage
    const saved = localStorage.getItem('custom_publications');
    const list = saved ? JSON.parse(saved) : [];
    
    const idx = list.findIndex((x: any) => x.id === pubId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...newArticles,
        deleteRequested: false, // reset deletion request on re-save
        deleteRequestReason: undefined,
        moderatorComment: undefined
      };
    } else {
      list.unshift(newArticles);
    }

    localStorage.setItem('custom_publications', JSON.stringify(list));

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onSaveSuccess();
    }, 1500);
  };

  const handleApplyPreset = (css: string) => {
    setSelectedCover(css);
    setCoverType('preset');
  };

  return (
    <div className="bg-slate-50 min-h-screen/80 font-sans pb-16 animate-in fade-in duration-300">
      {activeTypeDropdownBlockId && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setActiveTypeDropdownBlockId(null)}
        />
      )}
      
      {/* Top action bar */}
      <div className="bg-white px-6 py-4 border-b border-slate-205/95 sticky top-0 z-30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 border border-slate-200 hover:bg-slate-50 transition rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Назад в личный кабинет</span>
            <h2 className="font-extrabold text-sm text-slate-900 leading-tight">Редактор публикаций</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto">
          {saveSuccessMsg && (
            <div className="text-emerald-600 text-xs font-bold mr-2 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Публикация успешно сохранена!</span>
            </div>
          )}
          <button
            onClick={handleSavePublication}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-650/10 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Сохранить и отправить на модерацию</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 space-y-6">

        {/* 1. ARTICLE COVER AND COVER CONFIGURATOR */}
        <div className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Cover preview */}
          <div className={`h-40 bg-gradient-to-r ${coverType === 'preset' ? selectedCover : 'from-indigo-900 to-slate-900'} relative transition-all duration-300 flex items-end p-6 overflow-hidden`}>
            {coverType === 'custom' && customCoverUrl && (
              <img 
                src={customCoverUrl} 
                alt="Пользовательская обложка" 
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                style={{ objectPosition: `${coverX}% ${coverY}%` }}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-0" />
            <div className="relative z-10 text-white space-y-1">
              <span className="block text-[9.5px] uppercase font-mono font-black tracking-wider bg-white/20 px-2 py-0.5 rounded-lg w-max backdrop-blur-xs">
                Предпросмотр обложки
              </span>
            </div>
          </div>

          {/* Cover editing options */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Параметры и оформление обложки</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1.5">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-450 font-bold uppercase tracking-tight text-slate-500">Готовые градиенты</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COVERS.map(c => {
                    const isActive = coverType === 'preset' && selectedCover === c.css;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleApplyPreset(c.css)}
                        className={`p-2.5 rounded-xl border relative text-left text-[11px] font-bold text-slate-800 bg-white hover:border-slate-350 cursor-pointer transition ${
                          isActive 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/10' 
                            : 'border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${c.css} border border-white/20`} />
                          <span className="truncate">{c.name}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] text-slate-450 font-bold uppercase tracking-tight text-slate-500">Пользовательское изображение</label>
                <div className="flex flex-col gap-2">
                  <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                    <input
                      type="text"
                      value={customCoverUrl.startsWith('data:') ? 'Локальное изображение (Загружено)' : customCoverUrl}
                      onChange={(e) => {
                        setCustomCoverUrl(e.target.value);
                        setCoverType('custom');
                      }}
                      placeholder="https://images.unsplash.com/your-image-url..."
                      className="flex-1 px-3 bg-transparent text-xs text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                    />
                    {customCoverUrl && (
                      <button
                        onClick={() => { setCustomCoverUrl(''); setCoverType('preset'); }}
                        type="button"
                        className="px-2.5 py-1 text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                  
                  <div 
                    className="border border-dashed border-slate-300 rounded-xl bg-white p-3 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-indigo-400 cursor-pointer"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleCoverFileDrop}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Upload className="w-4 h-4 text-slate-450 animate-bounce" />
                      <span className="text-[11px] font-bold text-slate-700">Перетащите сюда обложку JPEG/PNG</span>
                    </div>
                    <label className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold cursor-pointer transition">
                      Или выберите файл
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg" 
                        onChange={handleCoverFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {coverType === 'custom' && customCoverUrl && (
                    <div className="bg-white border border-slate-200/85 p-3 rounded-2xl space-y-2 select-none shadow-3xs">
                      <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                          📐 Выбор фрагмента обложки
                        </span>
                        <button
                          type="button"
                          onClick={() => { setCoverX(50); setCoverY(50); }}
                          className="text-[9px] font-extrabold text-slate-400 hover:text-indigo-650 transition cursor-pointer"
                        >
                          Сбросить
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-700">
                            <span>По горизонтали (X):</span>
                            <span className="font-mono text-indigo-600">{coverX}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={coverX}
                            onChange={(e) => setCoverX(Number(e.target.value))}
                            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-700">
                            <span>По вертикали (Y):</span>
                            <span className="font-mono text-indigo-600">{coverY}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={coverY}
                            onChange={(e) => setCoverY(Number(e.target.value))}
                            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 italic">
                  *Вставьте URL или перетащите/загрузите изображение с компьютера
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TITLE AND TAG SELECTOR */}
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 space-y-5 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-tight text-slate-400">Категория (Тег) публикации</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'company_news', name: 'Новости Компаний' },
                { id: 'market_analytics', name: 'Аналитика Рынка' },
                { id: 'taxes_and_regulations', name: 'Налоги и Регуляторика' },
                { id: 'cases_interviews', name: 'Кейсы и Интервью' },
                { id: 'guides_tutorials', name: 'Практические Гайды' }
              ].map(cat => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tight">Название публикации</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название публикации..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-505 focus:bg-white placeholder-slate-400 shadow-sm font-sans"
            />
          </div>
        </div>

        {/* 3. DYNAMIC NOTION-STYLE BLOCK CONSTRUCTOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-500">Редактор контента статьи</h3>
            <span className="text-[10px] bg-slate-200 px-2.5 py-0.5 rounded-full font-mono font-bold text-slate-650">Блоков: {blocks.length}</span>
          </div>

          <div className="space-y-4">

          {/* In-line insertion above first block */}
          {blocks.length > 0 && (
            <div className="relative h-1 mt-1 -mb-1 group/insert flex items-center justify-center select-none z-20">
              <div className="absolute inset-x-0 h-[1.5px] bg-indigo-300 opacity-0 group-hover/insert:opacity-100 transition-opacity duration-200" />
              <button
                type="button"
                onClick={() => setInsertingAtIndex(0)}
                className="relative z-20 w-5 h-5 rounded-full bg-white border border-indigo-200 text-indigo-655 hover:text-indigo-750 hover:bg-indigo-50 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center opacity-0 group-hover/insert:opacity-100 scale-90 group-hover/insert:scale-100 active:scale-95 cursor-pointer"
                title="Добавить блок в самое начало"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          {insertingAtIndex === 0 && (
            <div className="my-4 bg-slate-50/90 border border-slate-250 rounded-2xl p-4.5 animate-in slide-in-from-top-2 duration-150 relative shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Вставить блок в начало
                </span>
                <button 
                  type="button"
                  onClick={() => setInsertingAtIndex(null)}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase"
                >
                  Отмена
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { type: 'heading_1', name: 'Заголовок H1', icon: Heading1 },
                  { type: 'heading_2', name: 'Заголовок H2', icon: Heading2 },
                  { type: 'heading_3', name: 'Заголовок H3', icon: Heading3 },
                  { type: 'paragraph', name: 'Обычный текст', icon: AlignLeft },
                  { type: 'bullet_list', name: 'Маркированный список', icon: List },
                  { type: 'numbered_list', name: 'Нумерованный список', icon: ListOrdered },
                  { type: 'image', name: 'Иллюстрация с подписью', icon: ImageIcon },
                  { type: 'table', name: 'Таблица показателей', icon: TableIcon },
                  { type: 'formula', name: 'Математическая формула', icon: Percent },
                  { type: 'spoiler_quote', name: 'Цитата со спойлером', icon: Eye },
                  { type: 'small_quote', name: 'Цитата малая (курсив)', icon: Quote },
                  { type: 'large_quote', name: 'Большая цитата эксперта', icon: Sparkles },
                  { type: 'company_card', name: 'Виджет связи компании', icon: ExternalLink },
                  { type: 'file_download', name: 'Вложение для скачивания', icon: Download },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => insertBlockAtIndex(item.type as any, 0)}
                      className="p-2.5 border border-slate-200 hover:border-indigo-200 rounded-xl bg-white hover:bg-indigo-50/20 text-left transition text-[11px] font-bold text-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                      <Icon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* This is the paper longread sheet */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-200/80 shadow-xs space-y-4">
            {blocks.map((block, idx) => {
              const isDragged = draggedIndex === idx;
              const isDragOver = dragOverIndex === idx;
              return (
                <div 
                  key={block.id} 
                  className={`relative group/block py-2.5 px-4 rounded-2xl border transition-all duration-200 ${
                    isDragged ? 'opacity-30 bg-slate-50 border-dashed border-indigo-400' : ''
                  } ${
                    isDragOver ? 'border-dashed border-indigo-400 bg-indigo-50/20' : 'border-transparent'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, idx)}
                >
                  
                  {/* Subtle Floating Controls on top-right of block */}
                  <div className={`absolute right-2 top-2 flex bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1 gap-1 transition-opacity duration-200 shadow-sm z-30 select-none ${
                    activeTypeDropdownBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover/block:opacity-100'
                  }`}>
                    {/* Interactive Dropdown to change block type */}
                    {(() => {
                      const activeConfig = BLOCK_TYPES_CONFIG.find(c => c.type === block.type);
                      const CurrentIcon = activeConfig?.icon || AlignLeft;
                      return (
                        <div className="relative flex items-center pr-1 mr-1 border-r border-slate-200/60 z-30">
                          <button
                            type="button"
                            onClick={() => setActiveTypeDropdownBlockId(activeTypeDropdownBlockId === block.id ? null : block.id)}
                            className="px-2 py-1 text-[10px] font-extrabold tracking-tight text-indigo-650 hover:text-white bg-indigo-50/70 hover:bg-indigo-600 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-150 border border-indigo-100/50 select-none"
                            title="Сменить тип блока"
                          >
                            <CurrentIcon className="w-3 h-3 flex-shrink-0 text-indigo-600" />
                            <span className="text-[9px] font-black uppercase tracking-wider">{activeConfig ? activeConfig.name.split(' ')[0] : 'Блок'}</span>
                            <ChevronDown className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
                          </button>

                          {activeTypeDropdownBlockId === block.id && (
                            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100 max-h-72 overflow-y-auto scrollbar-thin">
                              <div className="px-2 py-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 leading-none">
                                Сменить тип блока на:
                              </div>
                              {BLOCK_TYPES_CONFIG.map(item => {
                                const ItemIcon = item.icon;
                                const isCurrent = item.type === block.type;
                                return (
                                  <button
                                    key={item.type}
                                    type="button"
                                    onClick={() => {
                                      changeBlockType(block.id, item.type);
                                      setActiveTypeDropdownBlockId(null);
                                    }}
                                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[10.5px] font-bold flex items-center gap-2 transition cursor-pointer select-none border-0 ${
                                      isCurrent 
                                        ? 'bg-indigo-50 text-indigo-700 font-extrabold' 
                                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                  >
                                    <ItemIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span className="truncate">{item.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    <div
                      className="p-1 text-slate-400 hover:text-indigo-650 transition cursor-grab active:cursor-grabbing flex items-center justify-center"
                      title="Перетащите для изменения порядка"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 text-slate-400 hover:text-rose-650 transition cursor-pointer ml-1"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Rendering with 100% Identical style match to published article, but seamlessly editable */}
                  <div className="w-full">
                    
                    {/* H1 header match */}
                    {block.type === 'heading_1' && (
                      <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight tracking-tight mt-8 pb-2 border-b border-slate-100">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          placeholder="Заголовок H1"
                          className="w-full bg-transparent border-0 border-b border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none p-0 m-0 text-slate-900 font-black"
                        />
                      </h1>
                    )}

                    {/* H2 section match */}
                    {block.type === 'heading_2' && (
                      <h2 className="text-base md:text-md font-extrabold text-slate-900 leading-snug mt-6">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          placeholder="Заголовок H2"
                          className="w-full bg-transparent border-0 border-b border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none p-0 m-0 text-slate-900 font-extrabold"
                        />
                      </h2>
                    )}

                    {/* H3 sub-section match */}
                    {block.type === 'heading_3' && (
                      <h3 className="text-sm md:text-sm font-bold text-slate-900 leading-normal mt-4">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          placeholder="Заголовок H3"
                          className="w-full bg-transparent border-0 border-b border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none p-0 m-0 text-slate-900 font-bold"
                        />
                      </h3>
                    )}

                    {/* Paragraph body match - Auto expanding custom styling */}
                    {block.type === 'paragraph' && (
                      <p className="text-slate-705 leading-relaxed text-xs md:text-sm">
                        <textarea
                          rows={2}
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          placeholder="Наберите текст абзаца..."
                          className="w-full bg-transparent border-0 border-l border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none text-slate-700 leading-relaxed text-xs md:text-sm p-0 m-0 resize-none font-medium font-sans"
                          style={{ overflow: 'hidden' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = `${el.scrollHeight}px`;
                            }
                          }}
                        />
                      </p>
                    )}

                    {/* Lists (Bullets & Numbered) */}
                    {block.type === 'bullet_list' && (
                      <div className="space-y-2 font-sans my-4">
                        <ul className="list-disc pl-5 space-y-2 text-slate-700 text-xs md:text-sm">
                          {(block.listItems || []).map((item, lIdx) => (
                            <li key={lIdx} className="leading-relaxed relative group/list">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateListItem(block.id, lIdx, e.target.value, true)}
                                  placeholder="Элемент маркированного списка..."
                                  className="flex-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none p-0 text-slate-700 text-xs md:text-sm font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeListItem(block.id, lIdx, true)}
                                  className="opacity-0 group-hover/list:opacity-100 p-0.5 text-slate-350 hover:text-rose-500 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => addListItem(block.id, true)}
                          className="mt-1 text-[10px] font-extrabold text-indigo-650 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer w-max transition select-none"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Добавить пункт</span>
                        </button>
                      </div>
                    )}

                    {block.type === 'numbered_list' && (
                      <div className="space-y-2 font-sans my-4">
                        <ol className="list-decimal pl-5 space-y-2 text-slate-700 text-xs md:text-sm">
                          {(block.listItems || []).map((item, lIdx) => (
                            <li key={lIdx} className="leading-relaxed relative group/list">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateListItem(block.id, lIdx, e.target.value, false)}
                                  placeholder="Элемент нумерованного списка..."
                                  className="flex-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-200 focus:ring-0 focus:outline-none p-0 text-slate-700 text-xs md:text-sm font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeListItem(block.id, lIdx, false)}
                                  className="opacity-0 group-hover/list:opacity-100 p-0.5 text-slate-350 hover:text-rose-500 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ol>
                        <button
                          type="button"
                          onClick={() => addListItem(block.id, false)}
                          className="mt-1 text-[10px] font-extrabold text-indigo-650 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer w-max transition select-none"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Добавить пункт</span>
                        </button>
                      </div>
                    )}

                    {/* Image visual illustration block */}
                    {block.type === 'image' && (
                      <div 
                        className="my-6 space-y-3 text-center group/img relative p-4 bg-slate-50/50 rounded-3xl border border-slate-100 transition duration-250 hover:bg-slate-50 hover:border-indigo-100"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => handleImageFileDrop(e, block.id)}
                      >
                        {/* URL configuration bar */}
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-center bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl px-3 py-1.5 opacity-0 group-hover/img:opacity-100 transition shadow-sm z-20 select-none gap-2">
                          <div className="flex items-center gap-1.5 flex-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Ссылка (URL):</span>
                            <input 
                              type="text" 
                              value={block.imageUrl || ''} 
                              onChange={(e) => updateBlockProp(block.id, 'imageUrl', e.target.value)}
                              placeholder="Вставьте ссылку..." 
                              className="text-[10px] flex-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 focus:bg-white rounded outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase">ИЛИ:</span>
                            <label className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1">
                              <Upload className="w-3 h-3" />
                              <span>Выбрать JPEG/PNG</span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg" 
                                onChange={(e) => handleImageFileChange(e, block.id)} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>

                        {/* Image body or Empty state */}
                        {block.imageUrl ? (
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 max-h-96 flex items-center justify-center relative">
                            <img 
                              src={block.imageUrl} 
                              alt={block.imageCaption || 'Иллюстрация'} 
                              className="w-full h-full object-cover select-none"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-white p-6 flex flex-col items-center justify-center gap-2 min-h-48 transition hover:border-indigo-300">
                            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                              <Upload className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-700">Загрузите иллюстрацию для статьи</p>
                              <p className="text-[10px] text-slate-400 font-medium">Перетащите сюда JPEG/PNG файл или кликните ниже</p>
                            </div>
                            <label className="mt-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition flex items-center gap-1 sm:px-4">
                              <span>Выберите файл</span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg" 
                                onChange={(e) => handleImageFileChange(e, block.id)} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        )}
                        
                        <input 
                          type="text"
                          value={block.imageCaption || ''}
                          onChange={(e) => updateBlockProp(block.id, 'imageCaption', e.target.value)}
                          placeholder="Введите подпись к изображению..."
                          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-center text-xs text-slate-400 italic block font-sans p-0 m-0"
                        />
                      </div>
                    )}

                    {/* Table block (Indicators 3x3) */}
                    {block.type === 'table' && block.tableData && (
                      <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white group/table relative">
                        {/* Floating columns/rows edit overlay */}
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 flex items-center gap-1 opacity-0 group-hover/table:opacity-100 transition shadow-sm z-20 select-none">
                          <button type="button" onClick={() => addTableRow(block.id)} className="px-2 py-1 text-[9px] font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 transition cursor-pointer">+ Строка</button>
                          <button type="button" onClick={() => addTableCol(block.id)} className="px-2 py-1 text-[9px] font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 transition cursor-pointer">+ Столбец</button>
                          {block.tableData.rows.length > 1 && (
                            <button type="button" onClick={() => removeTableRow(block.id)} className="px-2 py-1 text-[9px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded text-rose-600 transition cursor-pointer">- Строка</button>
                          )}
                          {block.tableData.headers.length > 1 && (
                            <button type="button" onClick={() => removeTableCol(block.id)} className="px-2 py-1 text-[9px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded text-rose-600 transition cursor-pointer">- Столбец</button>
                          )}
                        </div>

                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              {block.tableData.headers.map((hdr, hIdx) => (
                                <th key={hIdx} className="p-3 border-r border-slate-200/60 font-extrabold text-slate-800">
                                  <input
                                    type="text"
                                    value={hdr}
                                    onChange={(e) => updateTableCell(block.id, 0, hIdx, e.target.value, true)}
                                    className="w-full bg-transparent font-extrabold text-slate-800 focus:outline-none p-0 border-0 focus:ring-0"
                                  />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-3 border-r border-slate-200/60 text-slate-650 font-medium">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) => updateTableCell(block.id, rIdx, cIdx, e.target.value, false)}
                                      className="w-full bg-transparent text-slate-650 font-medium focus:outline-none p-0 border-0 focus:ring-0"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Formula Editor Block (beautiful math box) */}
                    {block.type === 'formula' && (
                      <div className="my-6 p-6 bg-slate-50 border border-slate-200/80 rounded-[24px] space-y-4 group/form relative">
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md border border-slate-200 hover:border-indigo-200 rounded-xl px-2 py-1.5 flex items-center gap-1 opacity-0 group-hover/form:opacity-100 transition shadow-sm z-25 select-none font-sans">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Формула:</span>
                          <input 
                            type="text" 
                            value={block.content || ''} 
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                            placeholder="Формула (например: PV = SUM( PMT_t / (1 + r)^t ))" 
                            className="text-xs w-64 px-2 py-1 bg-white border border-slate-250 rounded focus:border-indigo-400 font-sans font-medium"
                          />
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 flex flex-col items-center justify-center space-y-4 shadow-2xs relative overflow-hidden select-none font-sans">
                          <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                          <div className="flex items-center justify-center font-serif text-lg md:text-xl text-slate-800 gap-1.5 select-all">
                            {block.content ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold italic text-indigo-650">{block.content.split('=')[0]?.trim() || 'PV'}</span>
                                {block.content.includes('=') && (
                                  <>
                                    <span className="mx-2.5 text-slate-400 font-sans font-light">=</span>
                                    <span className="text-slate-800 font-sans font-extrabold tracking-wide">
                                      {block.content.split('=')[1]?.trim()}
                                    </span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span>PV = SUM( PMT_t / (1 + r)^t )</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans font-semibold tracking-tight uppercase">
                            Математическая формула
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Spoiler quote block details */}
                    {block.type === 'spoiler_quote' && (
                      <div className="bg-white border border-sky-100 p-5 rounded-[24px] shadow-sm space-y-3 relative overflow-hidden my-6 group/spoiler font-sans">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/10 rounded-full blur-2xl opacity-40 -translate-y-6 pointer-events-none" />
                        <div className="flex items-center justify-between">
                          <input 
                            type="text"
                            value={block.spoilerLabel || ''}
                            onChange={(e) => updateBlockProp(block.id, 'spoilerLabel', e.target.value)}
                            placeholder="Подробнее..."
                            className="text-xs font-bold text-slate-805 bg-transparent border-0 focus:ring-0 focus:outline-none p-0 w-full font-sans"
                          />
                          <span className="text-[10px] font-extrabold text-indigo-655 shrink-0 font-sans">
                            👁 Показать подробности
                          </span>
                        </div>
                        <div>
                          <textarea
                            rows={2}
                            value={block.spoilerContent || ''}
                            onChange={(e) => updateBlockProp(block.id, 'spoilerContent', e.target.value)}
                            placeholder="Введите скрываемое содержимое публикации..."
                            className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none mt-3 text-xs md:text-[13px] text-slate-700 leading-relaxed font-sans font-medium italic relative z-10 pl-2 border-l-2 border-indigo-400 p-0 m-0 resize-none"
                            style={{ overflow: 'hidden' }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = `${target.scrollHeight}px`;
                            }}
                            ref={(el) => {
                              if (el) {
                                el.style.height = 'auto';
                                el.style.height = `${el.scrollHeight}px`;
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Small quote - simple italic quote with border */}
                    {block.type === 'small_quote' && (
                      <div className="my-6 pl-4 border-l-3 border-amber-500 bg-amber-50/10 py-2.5 rounded-r-15 pr-4">
                        <textarea
                          rows={2}
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          placeholder="Введите текст короткой цитаты..."
                          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-slate-700 italic leading-relaxed font-sans text-xs md:text-sm p-0 m-0 resize-none font-medium"
                        />
                      </div>
                    )}

                    {/* Large quote/callout constructor */}
                    {block.type === 'large_quote' && (
                      <div className="my-8 bg-sky-50/50 border border-sky-100/80 p-6 rounded-[28px] space-y-4 relative overflow-hidden group/large font-sans">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex items-start justify-between gap-4 select-none">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-indigo-700 border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-wider font-sans shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <input 
                              type="text"
                              value={block.largeQuoteTitle || ''}
                              onChange={(e) => updateBlockProp(block.id, 'largeQuoteTitle', e.target.value)}
                              placeholder="Тема..."
                              className="bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-[10px] text-indigo-700 font-black uppercase w-48 font-sans"
                            />
                          </div>
                        </div>

                        {/* Dynamic list of nested sub-blocks */}
                        <div className="space-y-3.5 relative z-10">
                          {(block.largeQuoteBlocks || []).map((sb, sbIdx) => {
                            const isSubDragged = draggedSub?.parentId === block.id && draggedSub?.idx === sbIdx;
                            const isSubDragOver = dragOverSub?.parentId === block.id && dragOverSub?.idx === sbIdx;

                            return (
                              <div
                                key={sb.id}
                                className={`group/sub-block flex items-start gap-2.5 p-2 rounded-xl border border-transparent transition duration-150 ${
                                  isSubDragged ? 'opacity-30 bg-sky-100/20 border-dashed border-sky-300' : ''
                                } ${
                                  isSubDragOver ? 'bg-sky-100/50 border-dashed border-sky-300' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleSubDragStart(e, block.id, sbIdx)}
                                onDragOver={(e) => handleSubDragOver(e, block.id, sbIdx)}
                                onDragEnd={handleSubDragEnd}
                                onDrop={(e) => handleSubDrop(e, block.id, sbIdx)}
                              >
                                {/* Grip Handle */}
                                <div className="mt-2 opacity-0 group-hover/sub-block:opacity-100 transition duration-150 cursor-grab active:cursor-grabbing text-slate-400 p-0.5 shrink-0 flex items-center justify-center">
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Heading 3 inside large quote */}
                                  {sb.type === 'heading_3' && (
                                    <input
                                      type="text"
                                      value={sb.content}
                                      onChange={(e) => updateNestedBlockContent(block.id, sb.id, e.target.value)}
                                      placeholder="Заголовок H3..."
                                      className="w-full bg-white border border-slate-200/70 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-xl px-3 py-1.5 text-xs text-indigo-950 font-black font-sans focus:outline-none"
                                    />
                                  )}

                                  {/* Paragraph inside large quote */}
                                  {sb.type === 'paragraph' && (
                                    <textarea
                                      rows={1}
                                      value={sb.content}
                                      onChange={(e) => updateNestedBlockContent(block.id, sb.id, e.target.value)}
                                      placeholder="Текст абзаца..."
                                      className="w-full bg-white border border-slate-200/70 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none resize-none font-medium"
                                      style={{ overflow: 'hidden' }}
                                      onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = `${target.scrollHeight}px`;
                                      }}
                                      ref={(el) => {
                                        if (el) {
                                          el.style.height = 'auto';
                                          el.style.height = `${el.scrollHeight}px`;
                                        }
                                      }}
                                    />
                                  )}

                                  {/* Small Quote inside large quote */}
                                  {sb.type === 'small_quote' && (
                                    <div className="border-l-3 border-amber-400 pl-3.5 bg-amber-50/20 py-2 rounded-r-xl pr-3">
                                      <textarea
                                        rows={1}
                                        value={sb.content}
                                        onChange={(e) => updateNestedBlockContent(block.id, sb.id, e.target.value)}
                                        placeholder="Малая цитата..."
                                        className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-xs text-slate-705 font-medium italic resize-none leading-relaxed"
                                        style={{ overflow: 'hidden' }}
                                        onInput={(e) => {
                                          const target = e.target as HTMLTextAreaElement;
                                          target.style.height = 'auto';
                                          target.style.height = `${target.scrollHeight}px`;
                                        }}
                                        ref={(el) => {
                                          if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = `${el.scrollHeight}px`;
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Bullet List inside large quote */}
                                  {sb.type === 'bullet_list' && (
                                    <div className="space-y-1.5 pl-1 font-sans">
                                      <ul className="space-y-1.5 pl-1 text-xs text-slate-750 font-sans">
                                        {(sb.listItems || []).map((item, lIdx) => (
                                          <li key={lIdx} className="flex items-center gap-2 group/sub-l">
                                            <span className="text-sky-500 shrink-0 select-none">•</span>
                                            <input
                                              type="text"
                                              value={item}
                                              onChange={(e) => updateNestedBlockListItem(block.id, sb.id, lIdx, e.target.value)}
                                              placeholder="Пункт списка..."
                                              className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-sans font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeNestedBlockListItem(block.id, sb.id, lIdx)}
                                              className="opacity-0 group-hover/sub-l:opacity-100 text-rose-500 hover:text-rose-700 transition cursor-pointer p-1 border-0 bg-transparent shrink-0"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                      <button
                                        type="button"
                                        onClick={() => addNestedBlockListItem(block.id, sb.id)}
                                        className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer select-none ml-2"
                                      >
                                        + Добавить пункт
                                      </button>
                                    </div>
                                  )}

                                  {/* Numbered List inside large quote */}
                                  {sb.type === 'numbered_list' && (
                                    <div className="space-y-1.5 pl-1 font-sans">
                                      <ol className="list-decimal space-y-1.5 pl-5 text-xs text-slate-755 font-sans">
                                        {(sb.listItems || []).map((item, lIdx) => (
                                          <li key={lIdx} className="group/sub-l leading-relaxed">
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => updateNestedBlockListItem(block.id, sb.id, lIdx, e.target.value)}
                                                placeholder="Нумерованный пункт..."
                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-sans font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removeNestedBlockListItem(block.id, sb.id, lIdx)}
                                                className="opacity-0 group-hover/sub-l:opacity-100 text-rose-500 hover:text-rose-700 transition cursor-pointer p-1 border-0 bg-transparent shrink-0"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </li>
                                        ))}
                                      </ol>
                                      <button
                                        type="button"
                                        onClick={() => addNestedBlockListItem(block.id, sb.id)}
                                        className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer select-none ml-5"
                                      >
                                        + Добавить пункт
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Mini Delete button for nested sub-block itself */}
                                <button
                                  type="button"
                                  onClick={() => deleteNestedBlock(block.id, sb.id)}
                                  className="opacity-0 group-hover/sub-block:opacity-100 text-slate-400 hover:text-rose-600 transition cursor-pointer p-1.5 shrink-0 border-0 bg-transparent mt-1"
                                  title="Удалить блок из цитаты"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Dynamic Sub-items Add Toolbar */}
                        <div className="pt-3 border-t border-sky-100/90 relative z-10 flex flex-wrap items-center gap-1.5 select-none font-sans">
                          <span className="text-[9px] font-black text-sky-600 uppercase tracking-wider mr-1">Вставить в цитату:</span>
                          <button
                            type="button"
                            onClick={() => addNestedBlock(block.id, 'paragraph')}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-705 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 active:scale-95 shadow-2xs hover:text-indigo-650 hover:border-indigo-150"
                          >
                            <span>+ Текст</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => addNestedBlock(block.id, 'heading_3')}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-705 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 active:scale-95 shadow-2xs hover:text-indigo-650 hover:border-indigo-150"
                          >
                            <span>+ Заголов H3</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => addNestedBlock(block.id, 'small_quote')}
                            className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 text-slate-705 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 active:scale-95 shadow-2xs hover:text-amber-600 hover:border-amber-200"
                          >
                            <span>+ Цитата</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => addNestedBlock(block.id, 'bullet_list')}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-705 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 active:scale-95 shadow-2xs hover:text-indigo-650 hover:border-indigo-150"
                          >
                            <span>+ Маркеры</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => addNestedBlock(block.id, 'numbered_list')}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-705 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1 active:scale-95 shadow-2xs hover:text-indigo-650 hover:border-indigo-150"
                          >
                            <span>+ Шаги</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Transition block to counterparty card */}
                    {block.type === 'company_card' && (
                      <div className="my-8 bg-slate-50 border border-slate-200/90 p-6 rounded-[24px] relative overflow-hidden group/company font-sans">
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                          <div className="space-y-1 z-10 w-full font-sans">
                            <div className="flex items-center gap-2 select-none">
                              <span className="text-[9px] font-black text-indigo-600 uppercase">Связь контрагента:</span>
                              <select
                                value={block.companyId}
                                onChange={(e) => updateBlockProp(block.id, 'companyId', e.target.value)}
                                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none"
                              >
                                {companyOptions.map(c => (
                                  <option key={c.id} value={c.id}>{c.shortName} (ИНН {c.id})</option>
                                ))}
                              </select>
                            </div>
                            <h4 className="text-sm md:text-base font-extrabold text-slate-900 font-sans leading-snug mt-1.5">
                              Узнайте больше о контрагенте {companyOptions.find(c => c.id === block.companyId)?.shortName || block.companyId}
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xl leading-relaxed font-sans mt-0.5">
                              Отраслевой разбор финансового левериджа, закредитованности и ревизии ППА обязательств.
                            </p>
                          </div>
                          <div className="px-5 py-3 bg-indigo-600 border border-indigo-650 hover:bg-indigo-700 text-white text-xs font-black uppercase rounded-2xl shrink-0 font-sans shadow-md shadow-indigo-600/15 select-none flex items-center gap-1.5 scale-90 md:scale-100 cursor-pointer">
                            <span>В карточку компании</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Block attaching download file in article -- 100% IDENTICAL to reader block */}
                    {block.type === 'file_download' && (
                      <div className="my-6 group/file relative">
                        {/* URL and config inputs on hover */}
                        <div className="absolute top-0 left-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl px-2 py-1 flex items-center gap-1.5 opacity-0 group-hover/file:opacity-100 transition shadow-sm z-20 select-none -translate-y-8 font-sans">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Название:</span>
                          <input 
                            type="text" 
                            value={block.fileName || ''} 
                            onChange={(e) => updateBlockProp(block.id, 'fileName', e.target.value)}
                            placeholder="Шаблон калькулятора..." 
                            className="text-[10px] w-48 px-1.5 py-0.5 bg-slate-50 border border-slate-200 focus:bg-white rounded"
                          />
                          <span className="text-[8px] font-black text-slate-400 uppercase">Размер:</span>
                          <input 
                            type="text" 
                            value={block.fileSize || ''} 
                            onChange={(e) => updateBlockProp(block.id, 'fileSize', e.target.value)}
                            placeholder="145 КБ" 
                            className="text-[10px] w-14 px-1.5 py-0.5 bg-slate-50 border border-slate-200 focus:bg-white rounded"
                          />
                        </div>

                        <div className="p-4 bg-emerald-50/10 border border-dashed border-emerald-250 rounded-2xl flex items-center gap-3 z-10 transition hover:border-emerald-350 pr-4 w-full md:max-w-xl font-sans">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-605 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <h5 className="font-extrabold text-xs text-slate-800 truncate" title={block.fileName}>{block.fileName || 'Вложение'}</h5>
                            <span className="block text-[10px] text-slate-450 font-mono mt-0.5 uppercase font-bold">{block.fileSize || '145 КБ'} · EXCEL</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => alert(`Калькулятор «${block.fileName}» скачан на жесткий диск.`)}
                            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 bg-white rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
                          >
                            <Download className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* In-line insertion below block (Between idx and idx+1) */}
                  <div className="relative h-1 mt-1 -mb-1 group/insert flex items-center justify-center select-none z-20">
                    <div className="absolute inset-x-0 h-[1.5px] bg-indigo-300 opacity-0 group-hover/insert:opacity-100 transition-opacity duration-200" />
                    <button
                      type="button"
                      onClick={() => setInsertingAtIndex(idx + 1)}
                      className="relative z-20 w-5 h-5 rounded-full bg-white border border-indigo-200 text-indigo-655 hover:text-indigo-750 hover:bg-indigo-50 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center opacity-0 group-hover/insert:opacity-100 scale-90 group-hover/insert:scale-100 active:scale-95 cursor-pointer"
                      title="Добавить блок сюда"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {insertingAtIndex === idx + 1 && (
                    <div className="my-4 bg-slate-50/90 border border-slate-250 rounded-2xl p-4.5 animate-in slide-in-from-top-2 duration-150 relative shadow-2xs font-sans">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                        <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Вставить блок сюда
                        </span>
                        <button 
                          type="button"
                          onClick={() => setInsertingAtIndex(null)}
                          className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase"
                        >
                          Отмена
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { type: 'heading_1', name: 'Заголовок H1', icon: Heading1 },
                          { type: 'heading_2', name: 'Заголовок H2', icon: Heading2 },
                          { type: 'heading_3', name: 'Заголовок H3', icon: Heading3 },
                          { type: 'paragraph', name: 'Обычный текст', icon: AlignLeft },
                          { type: 'bullet_list', name: 'Маркированный список', icon: List },
                          { type: 'numbered_list', name: 'Нумерованный список', icon: ListOrdered },
                          { type: 'image', name: 'Иллюстрация с подписью', icon: ImageIcon },
                          { type: 'table', name: 'Таблица показателей', icon: TableIcon },
                          { type: 'formula', name: 'Математическая формула', icon: Percent },
                          { type: 'spoiler_quote', name: 'Цитата со спойлером', icon: Eye },
                          { type: 'small_quote', name: 'Цитата малая (курсив)', icon: Quote },
                          { type: 'large_quote', name: 'Большая цитата эксперта', icon: Sparkles },
                          { type: 'company_card', name: 'Виджет связи компании', icon: ExternalLink },
                          { type: 'file_download', name: 'Вложение для скачивания', icon: Download },
                        ].map(item => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.type}
                              type="button"
                              onClick={() => insertBlockAtIndex(item.type as any, idx + 1)}
                              className="p-2.5 border border-slate-200 hover:border-indigo-200 rounded-xl bg-white hover:bg-indigo-50/20 text-left transition text-[11px] font-bold text-slate-705 cursor-pointer flex items-center gap-1.5"
                            >
                              <Icon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* 4. BLOCK INJECTOR PANEL (Clean Grid selector of buttons for Notion style block adding) */}
          <div className="bg-white border border-slate-200/90 rounded-[32px] p-5 space-y-4 shadow-sm select-none">
            <div className="flex flex-col border-b border-slate-100 pb-2 mb-1">
              <div className="flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-indigo-500" />
                <h4 className="text-[11.5px] font-black uppercase text-slate-800 tracking-wide">Панель элементов</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5 leading-tight">
                Перетащите в документ или нажмите для добавления:
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { type: 'heading_1', name: 'Заголовок H1', icon: Heading1 },
                { type: 'heading_2', name: 'Заголовок H2', icon: Heading2 },
                { type: 'heading_3', name: 'Заголовок H3', icon: Heading3 },
                { type: 'paragraph', name: 'Обычный текст', icon: AlignLeft },
                { type: 'bullet_list', name: 'Маркированный список', icon: List },
                { type: 'numbered_list', name: 'Нумерованный список', icon: ListOrdered },
                { type: 'image', name: 'Иллюстрация с подписью', icon: ImageIcon },
                { type: 'table', name: 'Таблица показателей', icon: TableIcon },
                { type: 'formula', name: 'Математическая формула', icon: Percent },
                { type: 'spoiler_quote', name: 'Цитата со спойлером', icon: Eye },
                { type: 'small_quote', name: 'Цитата малая (курсив)', icon: Quote },
                { type: 'large_quote', name: 'Большая цитата эксперта', icon: Sparkles },
                { type: 'company_card', name: 'Виджет связи компании', icon: ExternalLink },
                { type: 'file_download', name: 'Вложение для скачивания', icon: Download },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addBlock(item.type as any)}
                    draggable
                    onDragStart={(e) => handleToolDragStart(e, item.type as any)}
                    onDragEnd={handleToolDragEnd}
                    className="p-3 border border-slate-205 hover:border-indigo-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/80 hover:text-indigo-650 text-left transition text-xs font-black text-slate-705 cursor-grab active:cursor-grabbing flex items-center justify-between group shadow-2xs hover:shadow-xs active:scale-98"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1.5" />
                  </button>
                );
              })}
            </div>
          </div>

          </div>

        </div>

      </div>

    </div>
  );
}
