//
//  EditContacts.m
//  ReduxToolkit
//
//  Created by DeveshPuri Goswami on 08/09/1944 Saka.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(EditContacts,NSObject)

RCT_EXTERN_METHOD(fetchContacts:(RCTResponseSenderBlock)resolve)
RCT_EXTERN_METHOD(deleteContacts:(NSString*)nameToBeDeleted callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(addUserToContact:(NSString*)contactName contactNumber:(NSString*)contactNumber callback:(RCTResponseSenderBlock)callback)

@end
