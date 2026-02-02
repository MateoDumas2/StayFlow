export declare class CreateBookingInput {
    listingId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    isSplitPay?: boolean;
    invitedEmails?: string[];
}
