
#ifndef SUGER_INCLUDED
#define SUGER_INCLUDED

#include <memory>

#define self (*this)

template <class T>
using the = std::unique_ptr<T>;
template <class T>
using an = std::shared_ptr<T>;

// test needed
#ifdef EXTRA_SWEETNESS

#define def auto
#define pass
#define let auto
#define elif else if
#define in :

typedef int8_t i08; typedef int16_t i16; typedef int32_t i32; typedef int64_t i64;
typedef uint8_t u08; typedef uint16_t u16; typedef uint32_t u32; typedef uint64_t u64;

#define inf32 0x3f3f3f3f
#define inf64 0x3f3f3f3f3f3f3f3fll

#define fni32 (~inf32)
#define fni64 (~inf64)

#endif

#endif