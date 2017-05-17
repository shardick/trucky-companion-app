/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"96f85e99-028f-4e76-a0f2-0fd64660df8c"];
  
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"96f85e99-028f-4e76-a0f2-0fd64660df8c"
                                                      settings:@{kOSSettingsKeyAutoPrompt: @false}];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"trucky"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
  [RCTOneSignal didReceiveRemoteNotification:notification];
}

@end
