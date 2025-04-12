import {
  MdShortText,
  MdNotes,
  MdRadioButtonChecked,
  MdArrowDropDown,
  MdCheckCircle
} from 'react-icons/md';
import { Icon } from '@chakra-ui/react';

export const ShortTextIcon = () => <Icon as={MdShortText} />;
export const LongTextIcon = () => <Icon as={MdNotes} />;
export const RadioIcon = () => <Icon as={MdRadioButtonChecked} />;
export const DropdownIcon = () => <Icon as={MdArrowDropDown} />;
