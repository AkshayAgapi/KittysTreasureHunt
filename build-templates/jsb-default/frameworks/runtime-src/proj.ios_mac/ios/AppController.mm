/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "SDKWrapper.h"
#import "platform/ios/CCEAGLView-ios.h"
#import <Photos/Photos.h>
#import <MessageUI/MessageUI.h>

using namespace cocos2d;

@implementation AppController
static NSUInteger mask = UIInterfaceOrientationMaskAll;
Application* app = nullptr;
static AppController* appController = nil;
static RootViewController* instance = nil;
@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[SDKWrapper getInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    // Add the view controller's view to the window and display.
    float scale = [[UIScreen mainScreen] scale];
    CGRect bounds = [[UIScreen mainScreen] bounds];
    window = [[UIWindow alloc] initWithFrame: bounds];
    
    // cocos2d application instance
    app = new AppDelegate(bounds.size.width * scale, bounds.size.height * scale);
    app->setMultitouch(false);
    
    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
    instance = _viewController;
#ifdef NSFoundationVersionNumber_iOS_7_0
    _viewController.automaticallyAdjustsScrollViewInsets = NO;
    _viewController.extendedLayoutIncludesOpaqueBars = NO;
    _viewController.edgesForExtendedLayout = UIRectEdgeAll;
#else
    _viewController.wantsFullScreenLayout = YES;
#endif
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    
    //run the cocos2d-x game scene
    app->start();
    appController = self;
    
    return YES;
}

+(NSString *)getIdentifier{
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

+(NSString *)getDeviceName{
    return [[UIDevice currentDevice] name];
}

+(NSString *)getBundleid{
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    return bundleIdentifier;
}

+(NSString *)getClipboardContent{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *string = pasteboard.string;
    if (string) {
        return string;
    }

    return @"";
}

+(void)createFileeee {
    NSString *content = @"Hello, World!";
    NSString *filePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject stringByAppendingPathComponent:@"example.txt"];

    NSError *error;
    BOOL success = [content writeToFile:filePath atomically:YES encoding:NSUTF8StringEncoding error:&error];

    if (!success) {
        NSLog(@"Bro Error creating file: %@", error.localizedDescription);
    }
}

+(void)setClipboardContent:(NSString *)text {
    UIPasteboard* pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
}

+(void)setKeepScreenOn:(BOOL)val {
    [[UIApplication sharedApplication] setIdleTimerDisabled: val];
}

+(NSString *)getAppVersionCode{
    return @"1";
}

+(void)rotateScreen:(int)orient {
    mask = UIInterfaceOrientationMaskPortrait;
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    if(orient == 1){
        mask = UIInterfaceOrientationMaskLandscape;
        value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeLeft];
    }else if(orient == 2){
        mask = UIInterfaceOrientationMaskPortraitUpsideDown;
        value = [NSNumber numberWithInt:UIInterfaceOrientationPortraitUpsideDown];
    }else if(orient == 3){
        mask = UIInterfaceOrientationMaskLandscape;
        value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
    }
    
    if (@available(iOS 16.0, *)) {
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = (UIWindowScene *)array[0];
        
        UIWindowSceneGeometryPreferencesIOS *geometryPreferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:mask];
        [scene requestGeometryUpdateWithPreferences:geometryPreferences errorHandler:^(NSError * _Nonnull error) { }];
        [instance setNeedsUpdateOfSupportedInterfaceOrientations];
        [instance.navigationController setNeedsUpdateOfSupportedInterfaceOrientations];
    }else{
        dispatch_async(dispatch_get_main_queue(), ^{
            [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
            [UIViewController attemptRotationToDeviceOrientation];
        });
    }
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    CCLOG("supportedInterfaceOrientationsForWindow mask: ", mask);
    
    return mask;
}

-(UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return mask; // or any other specific orientations you want to support
}


+ (void)saveImageToPhotoLibrary:(NSString *)imageData {
    // Convert base64 image data to UIImage
    NSData *data = [[NSData alloc] initWithBase64EncodedString:imageData options:NSDataBase64DecodingIgnoreUnknownCharacters];
    UIImage *image = [UIImage imageWithData:data];
    
    // Request permission to access the photo library
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (status == PHAuthorizationStatusAuthorized) {
                [self saveImage:image];
//                JsbBridge* m = [JsbBridge sharedInstance];
//                [m sendToScript:@"saveImageToPhotoLibrary" arg1:@"1"];
            } else {
                NSLog(@"Permission to access photo library denied.");
//                JsbBridge* m = [JsbBridge sharedInstance];
//                [m sendToScript:@"saveImageToPhotoLibrary" arg1:@"0"];
            }
        });
    }];
}
+ (void)saveImage:(UIImage *)image {
    // Save the image to the photo library
    if (image) {
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil);
    }
}

+ (BOOL) isSupportSendSMS{
    if([MFMessageComposeViewController canSendText])
    {
        return true;
    }
    return false;
}

+ (BOOL) isSupportOrientation{
    return true;
}

+ (void)sendSMS: (NSString *)target withContent:(NSString *) content{
    MFMessageComposeViewController *controller = [[[MFMessageComposeViewController alloc] init] autorelease];
    if([MFMessageComposeViewController canSendText])
    {
        controller.body = content;
        controller.recipients = [NSArray arrayWithObjects: target, nil];
        controller.messageComposeDelegate = appController;
        [instance presentModalViewController:controller animated:YES];
        
    }
}


- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult) result
{
    
    [instance dismissViewControllerAnimated:YES completion:nil];
    switch (result) {
        case MessageComposeResultCancelled:
            break;
        case MessageComposeResultFailed:{
//            [AppController showArlet: @"Thông Báo" withContent: @"Gửi tin nhắn thất bại!"];
            break;
        }
        case MessageComposeResultSent:{
//            [AppController showArlet: @"Thông Báo" withContent: @"Gửi tin nhắn thành công!"];
            break;
        }
        default:
            break;
    }
}

//- (BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(NSString *)extensionPointIdentifier {
//    if ([extensionPointIdentifier isEqualToString: UIApplicationKeyboardExtensionPointIdentifier]) {
//        return NO;
//    }
//    return YES;
//}


+(void)setDeviceLandscape{
//    [appController setOrientationCurrent:YES];
       //rotate device
       NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
       [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
       [UIViewController attemptRotationToDeviceOrientation];
    
    NSLog(@"setDeviceLandscape");
    
    CGRect bounds = [[UIScreen mainScreen] bounds];
    float scale = [[UIScreen mainScreen] scale];
//    app->setScreenSize(bounds.size.height * scale, bounds.size.height * scale);
}

+(void)setDevicePortrait{
    //rotate device
    NSNumber *value = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    [[UIDevice currentDevice] setValue:value forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
    NSLog(@"setDevicePortrait");
    
             
    CGRect bounds = [[UIScreen mainScreen] bounds];
    float scale = [[UIScreen mainScreen] scale];
//    app->setScreenSize(bounds.size.width, bounds.size.height);
//    CGRect s = CGRectMake(0,0, bounds.size.width , bounds.size.height  );
//        appController.viewController.view.frame = s;
//
    
}

- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    [[SDKWrapper getInstance] applicationWillResignActive:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    [[SDKWrapper getInstance] applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    [[SDKWrapper getInstance] applicationDidEnterBackground:application];
    app->applicationDidEnterBackground();
    
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    [[SDKWrapper getInstance] applicationWillEnterForeground:application];
    app->applicationWillEnterForeground();
    
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    [[SDKWrapper getInstance] applicationWillTerminate:application];
    delete app;
    app = nil;
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
}

@end
