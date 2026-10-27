#import "SceneDelegate.h"

#import "AppDelegate.h"

// iOS 27 requires UIScene lifecycle adoption. RCTAppDelegate (RN 0.76) still
// builds its window in application:didFinishLaunchingWithOptions:, so attach
// that window to the scene here instead of creating a second one.
@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }
  AppDelegate *appDelegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
  UIWindow *window = appDelegate.window;
  window.windowScene = (UIWindowScene *)scene;
  self.window = window;
  [window makeKeyAndVisible];
}

@end
