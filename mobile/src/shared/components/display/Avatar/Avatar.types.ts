import {
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
  PressableProps,
} from 'react-native';

export type AvatarVariant = 'circle' | 'rounded' | 'square';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends Omit<PressableProps, 'style'> {
  /**
   * Local image source
   */
  source?: ImageSourcePropType;

  /**
   * Remote image URL (has lower priority than source)
   */
  uri?: string;

  /**
   * Full name to generate initials from (e.g., "John Doe" -> "JD")
   */
  name?: string;

  /**
   * Explicit initials to display (overrides name-derived initials)
   */
  initials?: string;

  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Shape variant of the avatar
   * @default 'circle'
   */
  variant?: AvatarVariant;

  /**
   * If true, renders a border around the avatar
   */
  border?: boolean;

  /**
   * Custom border color. Uses theme default if not provided
   */
  borderColor?: string;

  /**
   * Custom background color. Uses theme default if not provided
   */
  backgroundColor?: string;

  /**
   * Custom React node to render when no image or initials are available
   */
  placeholder?: React.ReactNode;

  /**
   * Custom React node to render as a badge over the avatar
   */
  badge?: React.ReactNode;

  /**
   * If true, renders a standard online indicator dot
   */
  online?: boolean;

  /**
   * If true, disables interaction and reduces opacity
   */
  disabled?: boolean;

  /**
   * If true, makes the avatar pressable (even without onPress)
   */
  pressable?: boolean;

  /**
   * Style applied to the outer container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Style applied to the internal Image component
   */
  imageStyle?: StyleProp<ImageStyle>;

  /**
   * Test identifier for e2e testing
   */
  testID?: string;
}
