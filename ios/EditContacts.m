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

RCT_EXTERN_METHOD(updateContacts:(NSString*)contactName contactNumber:(NSString*)contactNumber callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(dialNumber:(NSString*)contactNumber)

RCT_EXTERN_METHOD(messageToNumber:(NSString*)contactNumber message:(NSString*)message)

RCT_EXTERN_METHOD(videoCall:(NSString*)contactNumber)

RCT_EXTERN_METHOD(addAddress:(NSString*)contactName streetName:(NSString*)streetName cityName: (NSString*)cityName  stateName: (NSString*)stateName zipCode: (NSString*)zipCode countryName: (NSString*)countryName callback:(RCTResponseSenderBlock)callback)

@end
