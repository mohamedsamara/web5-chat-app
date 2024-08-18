/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="node" />

declare module "@microlink/react" {
  export interface MicrolinkProps {
    url: string;
  }

  export default class Microlink extends React.Component<
    MicrolinkProps & any,
    any
  > {}
}
