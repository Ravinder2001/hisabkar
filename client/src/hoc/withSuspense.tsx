import React, { ComponentType, Suspense, ReactNode } from "react";

/**
 * Wraps the React Component with React.Suspense and FallbackComponent while loading.
 * @param {ComponentType<P>} WrappedComponent - lazy loading component to wrap.
 * @param {ReactNode} FallbackComponent - component to show while the WrappedComponent is loading.
 * @returns {ComponentType<P>} - a new component wrapped with React.Suspense.
 */
export const withSuspense = <P extends object>(WrappedComponent: ComponentType<P>, FallbackComponent: ReactNode = null): ComponentType<P> => {
  return class WithSuspense extends React.Component<P> {
    render() {
      const Fallback = FallbackComponent || <div>Loading...</div>; // Default fallback
      return (
        <Suspense fallback={Fallback}>
          <WrappedComponent {...this.props} />
        </Suspense>
      );
    }
  };
};
