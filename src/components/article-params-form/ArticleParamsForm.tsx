import { useOutsideClickClose } from '@/ui/select/hooks/useOutsideClickClose'; // кастомный хук для закрытия сайдбара вне окна
import { clsx } from 'clsx'; // импорт clsx для объединения классов
import { useState, type FormEvent, useRef } from 'react'; // импорт хуков
import {
  // импорт данных для списков и дефолтное состояние
  fontFamilyOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
  fontSizeOptions,
  defaultArticleState,
  type ArticleStateType,
  type OptionType,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
// импорт ui-компонентов
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text'; // импорт текста

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply, // применяем проп
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // сайд бар закрываем по умолчанию(делаем элементы "умными")

  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState); // стейт равен дефолтному состоянию

  const handleChange = (
    // универсальный обработчик для формы
    key: keyof ArticleStateType,
    value: OptionType
  ): void => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  useOutsideClickClose({
    isOpen: isSidebarOpen,
    rootRef: sidebarRef,
    onChange: setIsSidebarOpen,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    // обработчик отправки формы
    event.preventDefault(); // останавливаем стандартное поведение страницы и ее перезагрузку
    onApply(formState); // применяем настройки к статье
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState); // сбрасываем локальный стейт формы
    onApply(defaultArticleState); // применяем откат к статье
  };

  return (
    <div ref={sidebarRef}>
      <ArrowButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {/* кидаем в isOpen в стрелку и переключаем состояние по клику */}
      <aside
        className={clsx(styles.container, { [styles.container_open]: isSidebarOpen })}
      >
        {/* добавляем класс */}
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          {/* шрифт */}
          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={(option) => handleChange('fontFamilyOption', option)}
          />
          {/* размер шрифта */}
          <RadioGroup
            title="Размер шрифта"
            name="fontSize"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={(option) => handleChange('fontSizeOption', option)}
          />
          {/* цвет текста */}
          <Select
            title="Цвет текста"
            options={fontColors}
            selected={formState.fontColor}
            onChange={(option) => handleChange('fontColor', option)}
          />
          <Separator /> {/* разделитель */}
          {/* цвет фона */}
          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={(option) => handleChange('backgroundColor', option)}
          />
          {/* ширина содержимого */}
          <Select
            title="ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={(option) => handleChange('contentWidth', option)}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
